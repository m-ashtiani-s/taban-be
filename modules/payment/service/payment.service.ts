import Config from "../../../config/config";
import { BadRequestError } from "../../../shared/base/badRequestError.error";
import OrderRepository from "../../order/repository/order.repository";
import OrderService from "../../order/service/order.service";
import { InitiatePaymentResult } from "../dto/payment.dto";
import { PaymentGateway, PaymentStatus } from "../model/payment.model";
import PaymentRepository from "../repository/payment.repository";
import { getStartPayUrl, requestPayment, verifyPayment } from "../provider/zarinpal.provider";

export default class PaymentService {
	private paymentRepository = new PaymentRepository();
	private orderRepository = new OrderRepository();
	private orderService = new OrderService();

	private get zp() {
		return Config.zarinpal;
	}

	// مبلغ سفارش به تومان است. اگر درگاه روی ریال (IRR) باشد ×۱۰ می‌کنیم.
	private toGatewayAmount(tomanAmount: number): number {
		return this.zp.currency === "IRT" ? Math.round(tomanAmount) : Math.round(tomanAmount) * 10;
	}

	private get callbackUrl(): string {
		return `${this.zp.callbackBase}/api/web/v1/payments/zarinpal/callback`;
	}

	/**
	 * اعتبارسنجی backUrl ارسالی از فرانت برای جلوگیری از open-redirect:
	 * فقط آدرس‌های http(s) که origin آن‌ها در CORS_ORIGINS مجاز باشد پذیرفته می‌شوند؛
	 * در غیر این صورت null برمی‌گردد و از آدرس پیش‌فرض config استفاده می‌شود.
	 */
	private sanitizeBackUrl(backUrl?: string | null): string | null {
		if (!backUrl) return null;
		try {
			const url = new URL(backUrl);
			if (url.protocol !== "http:" && url.protocol !== "https:") return null;
			const allowedOrigins = (process.env.CORS_ORIGINS || "")
				.split(",")
				.map((o) => o.trim())
				.filter(Boolean);
			if (allowedOrigins.length > 0 && !allowedOrigins.includes(url.origin)) return null;
			return url.toString();
		} catch {
			return null;
		}
	}

	private resultUrl(base: string | null | undefined, params: Record<string, string | number | undefined>): string {
		const target = base || this.zp.frontendResultUrl;
		const query = Object.entries(params)
			.filter(([, v]) => v !== undefined && v !== null && v !== "")
			.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
			.join("&");
		const sep = target.includes("?") ? "&" : "?";
		return query ? `${target}${sep}${query}` : target;
	}

	/**
	 * شروع پرداخت برای یک سفارش: بررسی می‌کند سفارش قابل پرداخت است، یک رکورد payment می‌سازد،
	 * از درگاه authority می‌گیرد و آدرس هدایت به درگاه را برمی‌گرداند. کاربر باید مالک سفارش باشد
	 * و سفارش در وضعیت «تایید جهت پرداخت» (approved) قرار داشته باشد.
	 */
	async initiateForOrder(userId: string, orderId: string, backUrl?: string | null) {
		if (!this.zp.merchantId) {
			throw new BadRequestError("درگاه پرداخت پیکربندی نشده است");
		}

		// اعتبارسنجی مالکیت/وضعیت سفارش و کوپن (بدون تغییر وضعیت). در صورت مشکل، exception پرتاب می‌شود.
		const order = await this.orderService.assertOrderPayable(userId, orderId);

		const alreadyPaid = await this.paymentRepository.findPaidByOrder(orderId);
		if (alreadyPaid) throw new BadRequestError("این سفارش قبلاً پرداخت شده است");

		const gatewayAmount = this.toGatewayAmount(order.finalAmount);
		const description = `پرداخت سفارش شماره ${order.orderNumber}`;

		const payment = await this.paymentRepository.create({
			gateway: PaymentGateway.ZARINPAL,
			order: orderId as any,
			user: userId as any,
			amount: gatewayAmount,
			currency: this.zp.currency,
			status: PaymentStatus.PENDING,
			description,
			backUrl: this.sanitizeBackUrl(backUrl),
		});

		const requestResult = await requestPayment({
			amount: gatewayAmount,
			description,
			callbackUrl: this.sanitizeBackUrl(backUrl)
		});

		if (!requestResult.success || !requestResult.authority) {
			await this.paymentRepository.update((payment._id as any).toString(), {
				status: PaymentStatus.FAILED,
				meta: { stage: "request", message: requestResult.message, code: requestResult.code },
			});
			throw new BadRequestError(requestResult.message || "شروع پرداخت با خطا مواجه شد");
		}

		await this.paymentRepository.update((payment._id as any).toString(), { authority: requestResult.authority });

		const data: InitiatePaymentResult = {
			paymentId: (payment._id as any).toString(),
			authority: requestResult.authority,
			redirectUrl: getStartPayUrl(requestResult.authority),
		};

		return {
			field: "initiatePayment",
			success: true,
			message: "لینک پرداخت با موفقیت ایجاد شد",
			data,
		};
	}

	/**
	 * هندل callback درگاه (هدایت مرورگر کاربر پس از پرداخت). این متد یک آدرس صفحه‌ی نتیجه در
	 * فرانت برمی‌گرداند تا کنترلر کاربر را به آن redirect کند. برای امنیت، مبلغ verify از خودِ
	 * رکورد payment خوانده می‌شود نه از کوئری callback. عملیات idempotent است.
	 */
	async handleZarinpalCallback(authority: string | undefined, status: string | undefined): Promise<string> {
		if (!authority) {
			return this.resultUrl(null, { status: "failed", reason: "invalid" });
		}

		const payment = await this.paymentRepository.findByAuthority(authority);
		if (!payment) {
			return this.resultUrl(null, { status: "failed", reason: "notfound" });
		}

		const orderId = (payment.order as any)?.toString();
		const userId = (payment.user as any)?.toString();

		// idempotency: اگر قبلاً پرداخت‌شده، همان نتیجه‌ی موفق را برگردان
		if (payment.status === PaymentStatus.PAID) {
			const paidOrder = await this.orderRepository.findByIdAndUser(orderId, userId);
			return this.resultUrl(payment.backUrl, {
				status: "success",
				refId: payment.refId ?? undefined,
				orderId,
				order: paidOrder?.orderNumber,
			});
		}

		// کاربر پرداخت را لغو/رها کرده است
		if (status !== "OK") {
			await this.paymentRepository.update((payment._id as any).toString(), {
				status: PaymentStatus.CANCELED,
				meta: { stage: "callback", zarinpalStatus: status },
			});
			return this.resultUrl(payment.backUrl, { status: "failed", reason: "canceled", orderId });
		}

		const verifyResult = await verifyPayment({ amount: payment.amount, authority });

		if (!verifyResult.success) {
			await this.paymentRepository.update((payment._id as any).toString(), {
				status: PaymentStatus.FAILED,
				meta: { stage: "verify", message: verifyResult.message, code: verifyResult.code },
			});
			return this.resultUrl(payment.backUrl, { status: "failed", reason: "verify", code: verifyResult.code, orderId });
		}

		// موفق: ابتدا رکورد پرداخت را PAID می‌کنیم (وجه تایید شده)، سپس سفارش را نهایی می‌کنیم.
		await this.paymentRepository.update((payment._id as any).toString(), {
			status: PaymentStatus.PAID,
			refId: verifyResult.refId ?? null,
			cardPan: verifyResult.cardPan ?? null,
			paidAt: new Date(),
			meta: { stage: "verify", code: verifyResult.code, alreadyVerified: verifyResult.alreadyVerified },
		});

		try {
			const order = await this.orderRepository.findByIdAndUser(orderId, userId);
			if (order) await this.orderService.finalizePaidOrder(order);
			const orderNumber = order?.orderNumber;
			return this.resultUrl(payment.backUrl, { status: "success", refId: verifyResult.refId, orderId, order: orderNumber });
		} catch (error) {
			return this.resultUrl(payment.backUrl, { status: "failed", reason: "server", orderId });
		}
	}
}

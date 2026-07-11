import mongoose from "mongoose";
import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import CartRepository from "../../cart/repository/cart.repository";
import CouponRepository from "../../coupon/repository/coupon.repository";
import CustomerRepository from "../../customer/repository/customer.repository";
import AdminInvoiceService from "../../invoice/service/invoice.admin.service";
import ClubService from "../../club/service/club.service";
import ReferralService from "../../referral/service/referral.service";
import RateCalculatorService from "../../rateCalculator/service/rateCalculator.service";
import ShippingAddressRepository from "../../shippingAddress/repository/shippingAddress.repository";
import { CreateOrderDto, UpdateOrderItemDto } from "../dto/order.dto";
import { OrderFilters } from "../dto/orderFilters.dto";
import { OrderDocument, OrderedDoc, OrderStatus, PaymentStatus } from "../model/order.model";
import OrderRepository from "../repository/order.repository";
import OrderTransform from "../transform/order.transform";

export default class OrderService {
	private orderRepository = new OrderRepository();
	private cartRepository = new CartRepository();
	private couponRepository = new CouponRepository();
	private customerRepository = new CustomerRepository();
	private shippingAddressRepository = new ShippingAddressRepository();
	private rateCalculatorService = new RateCalculatorService();
	private orderTransform = new OrderTransform();
	private invoiceService = new AdminInvoiceService();
	private clubService = new ClubService();
	private referralService = new ReferralService();

	async createOrder(userId: string, data: CreateOrderDto) {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			const cart = await this.cartRepository.findByUserId(userId, session);
			if (!cart || !cart.items || cart.items.length === 0) {
				throw new BadRequestError("سبد خرید شما خالی است");
			}

			const shippingAddress = await this.shippingAddressRepository.findByIdAndUser(data.shippingAddressId, userId);
			if (!shippingAddress) throw new BadRequestError("آدرس انتخاب‌شده معتبر نیست");

			// مشتری سفارش از روی آیتم‌های سبد استخراج می‌شود (همگی یک customerId مشترک دارند)
			const customerId = (cart.items[0]?.payload?.customerId ?? null) as string | null;
			if (customerId) {
				const customer = await this.customerRepository.findByIdAndEnterprise(customerId, userId);
				if (!customer) throw new BadRequestError("مشتری انتخاب‌شده معتبر نیست");
			}

			const orderedDocs: OrderedDoc[] = cart.items.map((item) => ({
				cartItemId: item.cartItemId,
				translationItemId: item.payload.translationItemId,
				translationItemTitle: item.breakdown.translationItemTitle,
				languageId: item.payload.languageId,
				languageName: item.breakdown.languageName,
				payload: item.payload,
				breakdown: item.breakdown,
				itemTotal: item.breakdown?.summary?.totalPrice ?? 0,
			}));

			const totalAmount = cart.cartSum ?? orderedDocs.reduce((sum, it) => sum + it.itemTotal, 0);
			const finalAmount = cart.cartSumWithDiscount ?? totalAmount;
			const discountAmount = Math.max(totalAmount - finalAmount, 0);
			const couponId = cart.appliedCoupon?.couponId ?? null;

			const orderNumber = await this.orderRepository.getNextOrderNumber(session);

			const order = await this.orderRepository.create(
				{
					orderNumber,
					user: userId,
					customer: customerId,
					orderedDocs,
					coupon: couponId,
					discountAmount,
					totalAmount,
					shippingAddress: data.shippingAddressId,
					status: OrderStatus.DOCUMENT_SUBMISSION,
					rejectedRemarks: null,
					paymentStatus: PaymentStatus.PENDING,
					finalAmount,
					remarks: data.remarks?.trim() ?? "",
				},
				session
			);

			// clear the cart
			cart.items = [];
			cart.cartSum = 0;
			cart.cartSumWithDiscount = 0;
			cart.appliedCoupon = null;
			await this.cartRepository.updateCart(cart, session);

			const populated = await this.orderRepository.findByIdAndUser((order._id as any).toString(), userId, session);

			await session.commitTransaction();
			session.endSession();

			return {
				field: "createOrder",
				success: true,
				message: "سفارش با موفقیت ثبت شد",
				data: this.orderTransform.order(populated ?? order),
			};
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	}

	async getOrders(userId: string, filters: OrderFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.orderRepository.findPaginatedByUser(userId, filters, pagination.getOptions());
		return {
			field: "getOrders",
			success: true,
			message: "لیست سفارش‌ها با موفقیت دریافت شد",
			data: this.orderTransform.paginatedOrders(paginated),
		};
	}

	async getOrderById(userId: string, orderId: string) {
		const order = await this.orderRepository.findByIdAndUser(orderId, userId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");
		return {
			field: "getOrderById",
			success: true,
			message: "سفارش با موفقیت دریافت شد",
			data: this.orderTransform.order(order),
		};
	}

	/**
	 * بررسی می‌کند که یک سفارش در وضعیت قابل پرداخت است و آن را برای شروع پرداخت برمی‌گرداند.
	 * توسط سرویس پرداخت پیش از هدایت کاربر به درگاه فراخوانی می‌شود. اگر روی سفارش کد تخفیف
	 * اعمال شده باشد، اعتبار کوپن هم پیش‌بررسی می‌شود (بدون مصرف ظرفیت — مصرف واقعی هنگام
	 * نهایی‌شدن پرداخت در finalizePaidOrder انجام می‌شود).
	 */
	async assertOrderPayable(userId: string, orderId: string): Promise<OrderDocument> {
		const order = await this.orderRepository.findByIdAndUser(orderId, userId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");

		if (order.paymentStatus === PaymentStatus.PAID || order.status === OrderStatus.PAID) {
			throw new BadRequestError("این سفارش قبلاً پرداخت شده است");
		}
		if (order.status !== OrderStatus.APPROVED) {
			throw new BadRequestError("این سفارش در وضعیت قابل پرداخت قرار ندارد");
		}

		const couponId = this.extractCouponId(order.coupon);
		if (couponId) await this.assertOrderCouponStillValid(userId, couponId);

		return order;
	}

	/**
	 * نهایی‌کردن یک سفارش پس از پرداخت موفق درگاه. این متد توسط callback درگاه (سرویس پرداخت)
	 * فراخوانی می‌شود و idempotent است: اگر سفارش قبلاً پرداخت‌شده باشد کاری انجام نمی‌دهد.
	 *
	 * اگر روی سفارش کد تخفیف اعمال شده باشد، شمارنده‌ی استفاده‌ی کوپن دقیقاً همین‌جا (و نه در
	 * لحظه‌ی هدایت به درگاه) به‌صورت اتمیک مصرف می‌شود تا حتی در پرداخت‌های هم‌زمان هم از سقف
	 * فراتر نرویم. در صورت شکست ذخیره‌سازی سفارش، ظرفیت رزروشده آزاد می‌شود.
	 */
	async finalizePaidOrder(order: OrderDocument): Promise<void> {
		if (order.paymentStatus === PaymentStatus.PAID || order.status === OrderStatus.PAID) return;

		const couponId = this.extractCouponId(order.coupon);
		if (couponId) {
			await this.assertOrderCouponStillValid(String((order.user as any)?._id ?? order.user), couponId);

			const consumed = await this.couponRepository.tryConsumeUsage(couponId);
			if (!consumed) {
				throw new BadRequestError(
					"ظرفیت استفاده از این کد تخفیف به پایان رسیده است. لطفاً آن را از سفارش حذف کرده و دوباره تلاش کنید"
				);
			}

			try {
				order.status = OrderStatus.PAID;
				order.paymentStatus = PaymentStatus.PAID;
				await this.orderRepository.save(order);
			} catch (error) {
				await this.couponRepository.releaseUsage(couponId);
				throw error;
			}
		} else {
			order.status = OrderStatus.PAID;
			order.paymentStatus = PaymentStatus.PAID;
			await this.orderRepository.save(order);
		}

		// با پرداخت سفارش، سیستم خودش صورتحساب را صادر و متعاقباً پرداخت‌شده می‌کند (idempotent)
		await this.invoiceService.issueForPaidOrder(order);
		// و امتیاز باشگاه مشتریان برای کاربر ثبت می‌شود (idempotent)
		await this.clubService.awardForPaidOrder(order);
		// اگر این کاربر با کد معرف ثبت‌نام کرده، روی اولین پرداخت برای معرِّفش کد تخفیف صادر می‌شود (idempotent)
		await this.referralService.rewardReferrerForFirstPaidOrder(order);
	}

	async removeCouponFromOrder(userId: string, orderId: string) {
		const order = await this.orderRepository.findByIdAndUser(orderId, userId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");

		if (order.paymentStatus === PaymentStatus.PAID || order.status === OrderStatus.PAID) {
			throw new BadRequestError("این سفارش پرداخت شده و امکان حذف کد تخفیف وجود ندارد");
		}

		if (!order.coupon) {
			throw new BadRequestError("کد تخفیفی روی این سفارش اعمال نشده است");
		}

		// با حذف کوپن، تخفیف صفر و مبلغ قابل پرداخت برابر جمع کل سفارش می‌شود.
		order.coupon = null;
		order.discountAmount = 0;
		order.finalAmount = order.totalAmount;
		await this.orderRepository.save(order);

		const populated = await this.orderRepository.findByIdAndUser(orderId, userId);
		return {
			field: "removeCouponFromOrder",
			success: true,
			message: "کد تخفیف از سفارش حذف شد",
			data: this.orderTransform.order(populated ?? order),
		};
	}

	/** شناسه‌ی کوپن را از مقدار coupon سفارش استخراج می‌کند؛ هم حالت populate و هم شناسه‌ی خام را پوشش می‌دهد. */
	private extractCouponId(coupon: unknown): string | null {
		if (!coupon) return null;
		if (typeof coupon === "string") return coupon;
		return (coupon as { _id?: { toString(): string } })?._id?.toString() ?? null;
	}

	/**
	 * تمام قوانین کوپن را در لحظه‌ی پرداخت دوباره می‌سنجد: فعال بودن، بازه‌ی زمانی،
	 * سقف کل استفاده و سقف استفاده‌ی هر کاربر. در صورت نقض هر قانون، خطا پرتاب می‌شود تا
	 * کاربر بتواند کد تخفیف را از سفارش حذف کرده و با مبلغ کامل پرداخت کند.
	 */
	private async assertOrderCouponStillValid(userId: string, couponId: string) {
		const coupon = await this.couponRepository.findByCouponId(couponId);
		if (!coupon) {
			throw new BadRequestError("کد تخفیف اعمال‌شده دیگر معتبر نیست. لطفاً آن را از سفارش حذف کرده و دوباره تلاش کنید");
		}

		const now = new Date();
		// کوپن‌های اختصاصی (مثل پاداش معرف) فقط برای کاربری که به او تخصیص داده شده مجازند
		if (coupon.assignedUser && String((coupon.assignedUser as any)?._id ?? coupon.assignedUser) !== String(userId)) {
			throw new BadRequestError("این کد تخفیف برای حساب شما صادر نشده است. لطفاً آن را از سفارش حذف کرده و دوباره تلاش کنید");
		}
		if (!coupon.isActive) {
			throw new BadRequestError("کد تخفیف اعمال‌شده غیرفعال شده است. لطفاً آن را از سفارش حذف کرده و دوباره تلاش کنید");
		}
		if (coupon.startDate && coupon.startDate > now) {
			throw new BadRequestError("کد تخفیف اعمال‌شده هنوز فعال نشده است. لطفاً آن را از سفارش حذف کرده و دوباره تلاش کنید");
		}
		if (coupon.endDate && coupon.endDate < now) {
			throw new BadRequestError("کد تخفیف اعمال‌شده منقضی شده است. لطفاً آن را از سفارش حذف کرده و دوباره تلاش کنید");
		}
		if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
			throw new BadRequestError("ظرفیت استفاده از این کد تخفیف به پایان رسیده است. لطفاً آن را از سفارش حذف کرده و دوباره تلاش کنید");
		}
		if (coupon.perUserLimit) {
			const usedByUser = await this.orderRepository.countPaidByUserAndCoupon(userId, couponId);
			if (usedByUser >= coupon.perUserLimit) {
				throw new BadRequestError("شما به سقف مجاز استفاده از این کد تخفیف رسیده‌اید. لطفاً آن را از سفارش حذف کرده و دوباره تلاش کنید");
			}
		}
	}

	async updateOrderItem(userId: string, orderId: string, cartItemId: string, payload: UpdateOrderItemDto) {
		const order = await this.orderRepository.findByIdAndUser(orderId, userId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");

		if (order.status !== OrderStatus.DOCUMENT_SUBMISSION && order.status !== OrderStatus.NEEDS_EDITING) {
			throw new BadRequestError("امکان ویرایش این سفارش وجود ندارد");
		}

		const index = order.orderedDocs.findIndex((it) => it.cartItemId === cartItemId);
		if (index === -1) throw new BadRequestError("آیتم مورد نظر در سفارش یافت نشد");

		const tierDiscountPercent = await this.clubService.getDiscountPercentForUser(userId);

		const breakdown = await this.rateCalculatorService.computeBreakdown(
			{
				translationItemId: payload.translationItemId,
				languageId: payload.languageId,
				documents: payload.documents,
				isOfficial: payload.isOfficial ?? true,
			},
			tierDiscountPercent
		);

		order.orderedDocs[index] = {
			cartItemId,
			translationItemId: payload.translationItemId,
			translationItemTitle: breakdown.translationItemTitle,
			languageId: payload.languageId,
			languageName: breakdown.languageName,
			payload: {
				translationItemId: payload.translationItemId,
				languageId: payload.languageId,
				documents: payload.documents,
				passports: payload.passports ?? [],
				assets: payload.assets ?? [],
				desiredDeliveryDate: payload.desiredDeliveryDate ?? null,
				isOfficial: payload.isOfficial ?? true,
			},
			breakdown,
			itemTotal: breakdown?.summary?.totalPrice ?? 0,
		};

		order.totalAmount = order.orderedDocs.reduce((sum, it) => sum + (it.itemTotal ?? 0), 0);
		order.finalAmount = Math.max(order.totalAmount - (order.discountAmount ?? 0), 0);

		// any edit puts the order back into the submission pipeline for re-review
		order.status = OrderStatus.DOCUMENT_SUBMISSION;
		order.rejectedRemarks = null;

		await this.orderRepository.save(order);

		const populated = await this.orderRepository.findByIdAndUser(orderId, userId);
		return {
			field: "updateOrderItem",
			success: true,
			message: "آیتم سفارش با موفقیت ویرایش شد",
			data: this.orderTransform.order(populated ?? order),
		};
	}
}

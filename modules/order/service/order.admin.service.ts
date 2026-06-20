import mongoose from "mongoose";
import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import AdminInvoiceService from "../../invoice/service/invoice.admin.service";
import ClubService from "../../club/service/club.service";
import ReferralService from "../../referral/service/referral.service";
import RateCalculatorService from "../../rateCalculator/service/rateCalculator.service";
import { UpdateDocumentScanAssetsDto, UpdateOrderItemOfficialDto, UpdateOrderStatusDto } from "../dto/order.dto";
import { OrderFilters } from "../dto/orderFilters.dto";
import { OrderStatus, PaymentStatus } from "../model/order.model";
import AdminOrderRepository from "../repository/order.admin.repository";
import AdminOrderTransform from "../transform/order.admin.transform";

export default class AdminOrderService {
	private orderRepository = new AdminOrderRepository();
	private orderTransform = new AdminOrderTransform();
	private invoiceService = new AdminInvoiceService();
	private clubService = new ClubService();
	private referralService = new ReferralService();
	private rateCalculatorService = new RateCalculatorService();

	async getOrders(filters: OrderFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.orderRepository.findPaginated(filters, pagination.getOptions());
		return {
			field: "getOrders",
			success: true,
			message: "لیست سفارش‌ها با موفقیت دریافت شد",
			data: this.orderTransform.paginatedOrders(paginated),
		};
	}

	async getOrderById(orderId: string) {
		const order = await this.orderRepository.findById(orderId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");
		return {
			field: "getOrderById",
			success: true,
			message: "سفارش با موفقیت دریافت شد",
			data: this.orderTransform.order(order),
		};
	}

	async updateDocumentScanAssets(orderId: string, cartItemId: string, documentKey: string, data: UpdateDocumentScanAssetsDto) {
		const order = await this.orderRepository.findById(orderId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");

		const cartItem = order.orderedDocs.find((d) => d.cartItemId === cartItemId);
		if (!cartItem) throw new NotFoundError("آیتم سفارش یافت نشد");

		const docInPayload = cartItem.payload?.documents?.find((d: any) => d.documentKey === documentKey);
		if (!docInPayload) throw new NotFoundError("مدرک مورد نظر یافت نشد");

		const updated = await this.orderRepository.updateDocumentScanAssets(orderId, cartItemId, documentKey, data.scanAssets);
		if (!updated) throw new NotFoundError("سفارش یافت نشد");

		return {
			field: "updateDocumentScanAssets",
			success: true,
			message: "فایل‌های اسکن با موفقیت ذخیره شدند",
			data: this.orderTransform.order(updated),
		};
	}

	async updateOrderItemOfficial(orderId: string, cartItemId: string, data: UpdateOrderItemOfficialDto) {
		const order = await this.orderRepository.findById(orderId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");

		if (order.paymentStatus === PaymentStatus.PAID) {
			throw new BadRequestError("این سفارش پرداخت شده و امکان تغییر نوع ترجمه وجود ندارد");
		}

		const index = order.orderedDocs.findIndex((d) => d.cartItemId === cartItemId);
		if (index === -1) throw new NotFoundError("آیتم سفارش یافت نشد");

		const item = order.orderedDocs[index];
		const payload = item.payload;

		const userId = (order.user as any)?._id?.toString() ?? order.user?.toString() ?? "";
		const tierDiscountPercent = userId ? await this.clubService.getDiscountPercentForUser(userId) : 0;

		const breakdown = await this.rateCalculatorService.computeBreakdown(
			{
				translationItemId: payload.translationItemId,
				languageId: payload.languageId,
				documents: payload.documents as any,
				isOfficial: data.isOfficial,
			},
			tierDiscountPercent
		);

		order.orderedDocs[index] = {
			...item,
			payload: { ...payload, isOfficial: data.isOfficial } as any,
			breakdown,
			itemTotal: breakdown.summary.totalPrice ?? 0,
		};

		order.totalAmount = order.orderedDocs.reduce((sum, it) => sum + (it.itemTotal ?? 0), 0);
		order.finalAmount = Math.max(order.totalAmount - (order.discountAmount ?? 0), 0);

		await this.orderRepository.save(order);

		const updated = await this.orderRepository.findById(orderId);
		return {
			field: "updateOrderItemOfficial",
			success: true,
			message: "نوع ترجمه با موفقیت بروزرسانی شد",
			data: this.orderTransform.order(updated!),
		};
	}

	async updateOrderStatus(orderId: string, data: UpdateOrderStatusDto) {
		const order = await this.orderRepository.findById(orderId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");

		if (data.status === OrderStatus.NEEDS_EDITING && (!data.rejectedRemarks || !data.rejectedRemarks.trim())) {
			throw new BadRequestError("برای ارجاع سفارش جهت ویرایش، وارد کردن دلیل الزامی است");
		}

		const rejectedRemarks = data.status === OrderStatus.NEEDS_EDITING ? data.rejectedRemarks!.trim() : null;

		let paymentStatus: PaymentStatus | undefined;
		if (data.status === OrderStatus.PAID) paymentStatus = PaymentStatus.PAID;

		// آیا سفارش با این تغییر، تازه به وضعیت پرداخت‌شده می‌رسد؟ (برای صدور خودکار صورتحساب)
		const becamePaid = data.status === OrderStatus.PAID && order.paymentStatus !== PaymentStatus.PAID;

		const session = await mongoose.startSession();
		session.startTransaction();
		try {
			const updated = await this.orderRepository.updateStatus(
				orderId,
				data.status,
				rejectedRemarks,
				paymentStatus,
				session
			);

			// با پرداخت سفارش، سیستم خودش صورتحساب را صادر و متعاقباً پرداخت‌شده می‌کند
			if (becamePaid) {
				await this.invoiceService.issueForPaidOrder(updated!, session);
				// و امتیاز باشگاه مشتریان برای کاربر ثبت می‌شود
				await this.clubService.awardForPaidOrder(updated!, session);
			}

			await session.commitTransaction();
			session.endSession();

			// پاداش معرف یک اثر جانبیِ best-effort است و پس از commit و خارج از تراکنش صادر می‌شود
			if (becamePaid) {
				await this.referralService.rewardReferrerForFirstPaidOrder(updated!);
			}

			return {
				field: "updateOrderStatus",
				success: true,
				message: "وضعیت سفارش با موفقیت به‌روزرسانی شد",
				data: this.orderTransform.order(updated!),
			};
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	}
}

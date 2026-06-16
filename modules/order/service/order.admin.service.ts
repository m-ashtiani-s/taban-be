import mongoose from "mongoose";
import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import AdminInvoiceService from "../../invoice/service/invoice.admin.service";
import { UpdateOrderStatusDto } from "../dto/order.dto";
import { OrderFilters } from "../dto/orderFilters.dto";
import { OrderStatus, PaymentStatus } from "../model/order.model";
import AdminOrderRepository from "../repository/order.admin.repository";
import AdminOrderTransform from "../transform/order.admin.transform";

export default class AdminOrderService {
	private orderRepository = new AdminOrderRepository();
	private orderTransform = new AdminOrderTransform();
	private invoiceService = new AdminInvoiceService();

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

	async updateOrderStatus(orderId: string, data: UpdateOrderStatusDto) {
		const order = await this.orderRepository.findById(orderId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");

		if (data.status === OrderStatus.REJECTED && (!data.rejectedRemarks || !data.rejectedRemarks.trim())) {
			throw new BadRequestError("برای رد سفارش، وارد کردن دلیل الزامی است");
		}

		const rejectedRemarks = data.status === OrderStatus.REJECTED ? data.rejectedRemarks!.trim() : null;

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
			}

			await session.commitTransaction();
			session.endSession();

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

import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import { OrderFilters, UpdateOrderStatusDto } from "../dto/order.dto";
import { PaymentStatus } from "../model/order.model";
import AdminOrderRepository from "../repository/order.admin.repository";
import AdminOrderTransform from "../transform/order.admin.transform";

export default class AdminOrderService {
	private orderRepository = new AdminOrderRepository();
	private orderTransform = new AdminOrderTransform();

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

		if (data.status === "rejected" && (!data.rejectedRemarks || !data.rejectedRemarks.trim())) {
			throw new BadRequestError("برای رد سفارش، وارد کردن دلیل الزامی است");
		}

		const rejectedRemarks = data.status === "rejected" ? data.rejectedRemarks!.trim() : null;

		let paymentStatus: PaymentStatus | undefined;
		if (data.status === "paid") paymentStatus = "paid";

		const updated = await this.orderRepository.updateStatus(orderId, data.status, rejectedRemarks, paymentStatus);

		return {
			field: "updateOrderStatus",
			success: true,
			message: "وضعیت سفارش با موفقیت به‌روزرسانی شد",
			data: this.orderTransform.order(updated!),
		};
	}
}

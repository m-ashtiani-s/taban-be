import mongoose, { PaginateResult } from "mongoose";
import OrderModel, { OrderDocument, OrderStatus, PaymentStatus } from "../model/order.model";
import { OrderFilters } from "../dto/orderFilters.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class AdminOrderRepository {
	async findById(orderId: string): Promise<OrderDocument | null> {
		return OrderModel.findById(orderId)
			.populate("user")
			.populate("shippingAddress")
			.populate("coupon")
			.populate("customer")
			.exec();
	}

	async findPaginated(
		filters: OrderFilters,
		pagination: PaginationInput
	): Promise<PaginationResult<OrderDocument>> {
		const query: any = {};

		if (filters.term) {
			const numeric = Number(filters.term);
			if (!Number.isNaN(numeric)) query.orderNumber = numeric;
		}
		if (filters.status) query.status = filters.status;
		if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
		if (filters.userId) query.user = filters.userId;
		if (filters.customerId) query.customer = filters.customerId;

		if (filters.dateFrom || filters.dateTo) {
			query.createdAt = {};
			if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
			if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
		}

		const res: PaginateResult<OrderDocument> = await OrderModel.paginate(query, {
			page: pagination.page,
			limit: pagination.limit,
			sort: pagination.sort,
			populate: ["user", "shippingAddress", "coupon"],
		});

		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}

	async updateStatus(
		orderId: string,
		status: OrderStatus,
		rejectedRemarks: string | null,
		paymentStatus?: PaymentStatus,
		session?: mongoose.ClientSession
	): Promise<OrderDocument | null> {
		const update: any = { status, rejectedRemarks };
		if (paymentStatus) update.paymentStatus = paymentStatus;
		let query = OrderModel.findByIdAndUpdate(orderId, { $set: update }, { new: true })
			.populate("user")
			.populate("shippingAddress")
			.populate("coupon");
		if (session) query = query.session(session);
		return query.exec();
	}
}

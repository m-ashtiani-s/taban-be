import mongoose, { PaginateResult } from "mongoose";
import OrderModel, { OrderDocument, PaymentStatus } from "../model/order.model";
import OrderCounterModel from "../model/orderCounter.model";
import { OrderFilters } from "../dto/orderFilters.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class OrderRepository {
	async getNextOrderNumber(session?: mongoose.ClientSession): Promise<number> {
		const counter = await OrderCounterModel.findByIdAndUpdate(
			"order",
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true, setDefaultsOnInsert: true, session }
		).exec();
		return counter?.seq ?? 100001;
	}

	async create(data: Partial<OrderDocument>, session?: mongoose.ClientSession): Promise<OrderDocument> {
		const order = new OrderModel(data);
		return order.save({ session });
	}

	async findByIdAndUser(orderId: string, userId: string, session?: mongoose.ClientSession): Promise<OrderDocument | null> {
		let query = OrderModel.findOne({ _id: orderId, user: userId })
			.populate("shippingAddress")
			.populate("coupon")
			.populate("customer");
		if (session) {
			query = query.session(session);
		}
		return query.exec();
	}

	async findPaginatedByUser(
		userId: string,
		filters: OrderFilters,
		pagination: PaginationInput
	): Promise<PaginationResult<OrderDocument>> {
		const query: any = { user: userId };

		if (filters.status) query.status = filters.status;
		if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
		if (filters.customerId) query.customer = filters.customerId;
		// فقط سفارش‌های ثبت‌شده برای یک مشتری زیرمجموعه (نه سفارش‌های شخصیِ بدون مشتری)
		if (filters.withCustomer) query.customer = { $ne: null };

		const res: PaginateResult<OrderDocument> = await OrderModel.paginate(query, {
			page: pagination.page,
			limit: pagination.limit,
			sort: pagination.sort,
			populate: ["shippingAddress", "customer"],
		});

		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}

	async save(order: OrderDocument): Promise<OrderDocument> {
		order.markModified("orderedDocs");
		return order.save();
	}

	/**
	 * تعداد سفارش‌های پرداخت‌شده‌ی یک کاربر که از یک کد تخفیف مشخص استفاده کرده‌اند.
	 * برای بررسی محدودیت «تعداد استفاده‌ی هر کاربر» در زمان پرداخت استفاده می‌شود. شناسه‌ها
	 * صریحاً به ObjectId تبدیل می‌شوند تا مطابقت کوئری قطعی باشد.
	 */
	async countPaidByUserAndCoupon(userId: string, couponId: string): Promise<number> {
		return OrderModel.countDocuments({
			user: new mongoose.Types.ObjectId(userId),
			coupon: new mongoose.Types.ObjectId(couponId),
			paymentStatus: PaymentStatus.PAID,
		}).exec();
	}

	async existsByTranslationItem(translationItemId: string): Promise<boolean> {
		const found = await OrderModel.exists({ "orderedDocs.translationItemId": translationItemId }).exec();
		return !!found;
	}

	async existsByLanguage(languageId: string): Promise<boolean> {
		const found = await OrderModel.exists({ "orderedDocs.languageId": languageId }).exec();
		return !!found;
	}

	// سفارت/استعلام در سفارش فقط با نام (نه شناسه) داخل breakdown ذخیره می‌شوند؛ چون عنوان این
	// موجودیت‌ها یکتاست، تطبیق با نام امن است و حتی وقتی نرخِ مربوطه حذف شده باشد هم کار می‌کند.
	async existsByEmbassyName(embassyName: string): Promise<boolean> {
		const found = await OrderModel.exists({
			"orderedDocs.breakdown.documents.embassyApprovals.embassyName": embassyName,
		}).exec();
		return !!found;
	}

	async existsByJusticeInquiryName(justiceInquiryName: string): Promise<boolean> {
		const found = await OrderModel.exists({
			"orderedDocs.breakdown.documents.justiceInquiries.justiceInquiryName": justiceInquiryName,
		}).exec();
		return !!found;
	}
}

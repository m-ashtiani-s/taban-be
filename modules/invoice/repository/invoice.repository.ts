import mongoose, { PaginateResult } from "mongoose";
import InvoiceModel, { InvoiceDocument, InvoiceReferenceType, InvoiceStatus } from "../model/invoice.model";
import InvoiceCounterModel from "../model/invoiceCounter.model";
import { InvoiceFilters } from "../dto/invoiceFilters.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class InvoiceRepository {
	async getNextInvoiceNumber(session?: mongoose.ClientSession): Promise<number> {
		const counter = await InvoiceCounterModel.findByIdAndUpdate(
			"invoice",
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true, setDefaultsOnInsert: true, session }
		).exec();
		return counter?.seq ?? 100001;
	}

	async create(data: Partial<InvoiceDocument>, session?: mongoose.ClientSession): Promise<InvoiceDocument> {
		const invoice = new InvoiceModel(data);
		return invoice.save({ session });
	}

	async findById(invoiceId: string): Promise<InvoiceDocument | null> {
		return InvoiceModel.findById(invoiceId).populate("user").exec();
	}

	/**
	 * صورتحساب متعلق به یک کاربر مشخص — تنها صورتحساب‌هایی که از حالت پیش‌نویس خارج شده‌اند
	 * (صادرشده یا پرداخت‌شده) برای کاربر قابل دسترسی‌اند؛ پیش‌نویس‌های ادمین دیده نمی‌شوند.
	 */
	async findByIdAndUser(invoiceId: string, userId: string): Promise<InvoiceDocument | null> {
		return InvoiceModel.findOne({
			_id: invoiceId,
			user: userId,
			status: { $in: [InvoiceStatus.ISSUED, InvoiceStatus.PAID] },
		})
			.populate("user")
			.exec();
	}

	async findPaginatedByUser(
		userId: string,
		filters: InvoiceFilters,
		pagination: PaginationInput
	): Promise<PaginationResult<InvoiceDocument>> {
		const query: any = {
			user: userId,
			status: { $in: [InvoiceStatus.ISSUED, InvoiceStatus.PAID] },
		};

		if (filters.status && [InvoiceStatus.ISSUED, InvoiceStatus.PAID].includes(filters.status)) {
			query.status = filters.status;
		}
		if (filters.term) {
			const numeric = Number(filters.term);
			if (!Number.isNaN(numeric)) query.invoiceNumber = numeric;
		}
		if (filters.dateFrom || filters.dateTo) {
			query.createdAt = {};
			if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
			if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
		}

		const res: PaginateResult<InvoiceDocument> = await InvoiceModel.paginate(query, {
			page: pagination.page,
			limit: pagination.limit,
			sort: pagination.sort,
			populate: ["user"],
		});

		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}

	async findOneByReference(
		referenceType: InvoiceReferenceType,
		referenceId: string,
		session?: mongoose.ClientSession
	): Promise<InvoiceDocument | null> {
		let query = InvoiceModel.findOne({ referenceType, referenceId });
		if (session) query = query.session(session);
		return query.exec();
	}

	async findByReference(referenceType: InvoiceReferenceType, referenceId: string): Promise<InvoiceDocument[]> {
		return InvoiceModel.find({ referenceType, referenceId })
			.populate("user")
			.sort({ createdAt: -1 })
			.exec();
	}

	async findPaginated(
		filters: InvoiceFilters,
		pagination: PaginationInput
	): Promise<PaginationResult<InvoiceDocument>> {
		const query: any = {};

		if (filters.term) {
			const numeric = Number(filters.term);
			if (!Number.isNaN(numeric)) query.invoiceNumber = numeric;
		}
		if (filters.status) query.status = filters.status;
		if (filters.referenceType) query.referenceType = filters.referenceType;
		if (filters.issuerType) query.issuerType = filters.issuerType;
		if (filters.userId) query.user = filters.userId;

		if (filters.dateFrom || filters.dateTo) {
			query.createdAt = {};
			if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
			if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
		}

		const res: PaginateResult<InvoiceDocument> = await InvoiceModel.paginate(query, {
			page: pagination.page,
			limit: pagination.limit,
			sort: pagination.sort,
			populate: ["user"],
		});

		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}

	async update(
		invoiceId: string,
		data: Partial<InvoiceDocument>,
		session?: mongoose.ClientSession
	): Promise<InvoiceDocument | null> {
		let query = InvoiceModel.findByIdAndUpdate(invoiceId, { $set: data }, { new: true, runValidators: true }).populate(
			"user"
		);
		if (session) query = query.session(session);
		return query.exec();
	}
}

import { PaginateResult } from "mongoose";
import CouponModel, { CouponDocument } from "../model/coupon.model";
import { CreateCouponDto, UpdateCouponDto } from "../dto/coupon.dto";
import { CouponFilters } from "../dto/couponFilters.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class CouponRepository {
	async findByCouponId(couponId: string, populateFields?: string[]): Promise<CouponDocument | null> {
		let query = CouponModel.findById(couponId);
		if (populateFields && populateFields.length > 0) {
			populateFields.forEach((field) => {
				query = query.populate(field);
			});
		}
		return query.exec();
	}

	async findByCode(code: string, populateFields?: string[]): Promise<CouponDocument | null> {
		let query = CouponModel.findOne({ code: code.toUpperCase() });
		if (populateFields && populateFields.length > 0) {
			populateFields.forEach((field) => {
				query = query.populate(field);
			});
		}
		return query.exec();
	}

	async findPaginated(
		filters: CouponFilters,
		pagination: PaginationInput,
		populateFields?: string[]
	): Promise<PaginationResult<CouponDocument>> {
		const query: any = {};

		if (filters.term) {
			query.code = { $regex: filters.term, $options: "i" };
		}
		if (filters.discountType) {
			query.discountType = filters.discountType;
		}
		if (filters.appliesTo) {
			query.appliesTo = filters.appliesTo;
		}
		if (filters.isActive !== undefined) {
			query.isActive = filters.isActive;
		}

		const res: PaginateResult<CouponDocument> = await CouponModel.paginate(query, {
			page: pagination.page,
			limit: pagination.limit,
			sort: pagination.sort,
			populate: populateFields ?? [],
		});

		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}

	async createCoupon(data: CreateCouponDto): Promise<CouponDocument> {
		const coupon = new CouponModel(data);
		return coupon.save();
	}

	async updateCoupon(couponId: string, data: Partial<UpdateCouponDto>): Promise<CouponDocument | null> {
		return CouponModel.findByIdAndUpdate(couponId, { $set: data }, { new: true, runValidators: true }).exec();
	}

	async setActiveStatus(couponId: string, isActive: boolean): Promise<CouponDocument | null> {
		return CouponModel.findByIdAndUpdate(couponId, { isActive }, { new: true }).exec();
	}

	async incrementUsage(couponId: string): Promise<void> {
		await CouponModel.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } }).exec();
	}

	/**
	 * ظرفیت کلی کوپن را به‌صورت اتمیک مصرف می‌کند: شمارنده‌ی استفاده فقط در صورتی یک واحد
	 * افزایش می‌یابد که یا سقفی تعریف نشده باشد یا هنوز به سقف نرسیده باشیم. این عملیات در
	 * یک کوئری اتمیک انجام می‌شود تا حتی هنگام پرداخت‌های هم‌زمان، استفاده از سقف مجاز فراتر نرود.
	 * مقدار بازگشتی true یعنی ظرفیت با موفقیت رزرو شد و false یعنی سقف پر بوده است.
	 */
	async tryConsumeUsage(couponId: string): Promise<boolean> {
		const res = await CouponModel.updateOne(
			{
				_id: couponId,
				$or: [{ usageLimit: null }, { $expr: { $lt: ["$usedCount", "$usageLimit"] } }],
			},
			{ $inc: { usedCount: 1 } }
		).exec();
		return res.modifiedCount === 1;
	}

	/** در صورت لغو/شکست پس از مصرف ظرفیت، شمارنده را یک واحد کاهش می‌دهد (کف صفر). */
	async releaseUsage(couponId: string): Promise<void> {
		await CouponModel.updateOne(
			{ _id: couponId, usedCount: { $gt: 0 } },
			{ $inc: { usedCount: -1 } }
		).exec();
	}
}

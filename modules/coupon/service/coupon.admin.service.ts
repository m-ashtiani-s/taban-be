import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import TranslationItemRepository from "../../translation/translationItem/repository/translationItem.repository";
import { CreateCouponDto, UpdateCouponDto } from "../dto/coupon.dto";
import { CouponFilters } from "../dto/couponFilters.dto";
import { DiscountType } from "../model/coupon.model";
import CouponRepository from "../repository/coupon.repository";
import CouponTransform from "../transform/coupon.transform";

export default class AdminCouponService {
	private couponRepository = new CouponRepository();
	private translationItemRepository = new TranslationItemRepository();

	async getCoupons(filters: CouponFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.couponRepository.findPaginated(filters, pagination.getOptions(), [
			"applicableTranslationItems",
		]);
		return {
			field: "getCoupons",
			success: true,
			message: "لیست کدهای تخفیف با موفقیت دریافت شد",
			data: new CouponTransform().paginatedCoupons(paginated),
		};
	}

	async getCouponById(couponId: string) {
		const coupon = await this.couponRepository.findByCouponId(couponId, ["applicableTranslationItems"]);
		if (!coupon) throw new NotFoundError("کد تخفیف یافت نشد");
		return {
			field: "getCouponById",
			success: true,
			message: "کد تخفیف با موفقیت دریافت شد",
			data: new CouponTransform().coupon(coupon),
		};
	}

	async createCoupon(data: CreateCouponDto) {
		await this.validateCouponData(data);

		const existing = await this.couponRepository.findByCode(data.code);
		if (existing) throw new BadRequestError("کدی با این عنوان قبلاً ثبت شده است");

		const normalized = this.normalizePayload(data);
		const coupon = await this.couponRepository.createCoupon(normalized as CreateCouponDto);
		return {
			field: "createCoupon",
			success: true,
			message: "کد تخفیف با موفقیت ایجاد شد",
			data: new CouponTransform().coupon(coupon),
		};
	}

	async updateCoupon(couponId: string, data: UpdateCouponDto) {
		const coupon = await this.couponRepository.findByCouponId(couponId);
		if (!coupon) throw new NotFoundError("کد تخفیف یافت نشد");

		await this.validateCouponData(data, couponId);

		const normalized = this.normalizePayload(data);
		const updated = await this.couponRepository.updateCoupon(couponId, normalized);
		if (!updated) throw new BadRequestError("ویرایش کد تخفیف با خطا مواجه شد");

		const populated = await this.couponRepository.findByCouponId(couponId, ["applicableTranslationItems"]);
		return {
			field: "updateCoupon",
			success: true,
			message: "کد تخفیف با موفقیت ویرایش شد",
			data: new CouponTransform().coupon(populated!),
		};
	}

	async activateCoupon(couponId: string) {
		const coupon = await this.couponRepository.findByCouponId(couponId);
		if (!coupon) throw new NotFoundError("کد تخفیف یافت نشد");
		if (coupon.isActive) throw new BadRequestError("کد تخفیف از قبل فعال است");

		await this.couponRepository.setActiveStatus(couponId, true);
		return {
			field: "activateCoupon",
			success: true,
			message: "کد تخفیف با موفقیت فعال شد",
			data: null,
		};
	}

	async deactivateCoupon(couponId: string) {
		const coupon = await this.couponRepository.findByCouponId(couponId);
		if (!coupon) throw new NotFoundError("کد تخفیف یافت نشد");
		if (!coupon.isActive) throw new BadRequestError("کد تخفیف از قبل غیرفعال است");

		await this.couponRepository.setActiveStatus(couponId, false);
		return {
			field: "deactivateCoupon",
			success: true,
			message: "کد تخفیف با موفقیت غیرفعال شد",
			data: null,
		};
	}

	private normalizePayload(data: CreateCouponDto): Partial<CreateCouponDto> {
		return {
			...data,
			code: data.code?.trim().toUpperCase(),
			maxDiscountAmount: data.maxDiscountAmount ?? null,
			minPurchaseAmount: data.minPurchaseAmount ?? null,
			startDate: data.startDate ? new Date(data.startDate) : null,
			endDate: data.endDate ? new Date(data.endDate) : null,
			usageLimit: data.usageLimit ?? null,
			perUserLimit: data.perUserLimit ?? null,
			isActive: data.isActive ?? true,
			description: data.description ?? "",
			applicableTranslationItems: data.applicableTranslationItems ?? [],
		};
	}

	private async validateCouponData(data: CreateCouponDto, excludeCouponId?: string) {
		if (excludeCouponId) {
			const existing = await this.couponRepository.findByCode(data.code);
			if (existing && String(existing._id) !== excludeCouponId) {
				throw new BadRequestError("کدی با این عنوان قبلاً ثبت شده است");
			}
		}

		if (data.discountType === DiscountType.PERCENT && data.discountValue > 100) {
			throw new BadRequestError("مقدار تخفیف درصدی نمی‌تواند بیشتر از ۱۰۰ باشد");
		}

		if (!!data.maxDiscountAmount && data.discountType === DiscountType.FIXED) {
			throw new BadRequestError("سقف تخفیف فقط برای نوع درصدی قابل تنظیم است");
		}

		if (data.startDate && data.endDate) {
			if (new Date(data.endDate) <= new Date(data.startDate)) {
				throw new BadRequestError("تاریخ پایان باید بعد از تاریخ شروع باشد");
			}
		}

		if (data.applicableTranslationItems && data.applicableTranslationItems.length > 0) {
			const uniqueIds = [...new Set(data.applicableTranslationItems.map(String))];
			for (const id of uniqueIds) {
				const item = await this.translationItemRepository.findByTranslationItemId(id);
				if (!item) {
					throw new BadRequestError("یک یا چند مدرک انتخاب‌شده وجود ندارد");
				}
			}
		}
	}
}

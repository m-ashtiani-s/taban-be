import { AppliesTo, DiscountType } from "../model/coupon.model";

export interface CreateCouponDto {
	code: string;
	discountType: DiscountType;
	discountValue: number;
	maxDiscountAmount?: number | null;
	minPurchaseAmount?: number | null;
	startDate?: string | Date | null;
	endDate?: string | Date | null;
	usageLimit?: number | null;
	perUserLimit?: number | null;
	isActive?: boolean;
	description?: string;
	appliesTo: AppliesTo;
	applicableTranslationItems?: string[];
}

export type UpdateCouponDto = CreateCouponDto;

export interface CouponDto {
	couponId: string;
	code: string;
	discountType: DiscountType;
	discountValue: number;
	maxDiscountAmount: number | null;
	minPurchaseAmount: number | null;
	startDate: Date | null;
	endDate: Date | null;
	usageLimit: number | null;
	usedCount: number;
	perUserLimit: number | null;
	isActive: boolean;
	description: string;
	appliesTo: AppliesTo;
	applicableTranslationItems: { translationItemId: string; title: string }[] | string[];
	createdAt: Date;
	updatedAt: Date;
}

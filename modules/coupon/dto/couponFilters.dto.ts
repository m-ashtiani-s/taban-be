import { AppliesTo, DiscountType } from "../model/coupon.model";

export interface CouponFilters {
	term?: string;
	discountType?: DiscountType;
	appliesTo?: AppliesTo;
	isActive?: boolean;
}

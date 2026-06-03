import { CartItemDto } from "./cartItem.dto";

export interface AppliedCouponDocumentDiscountDto {
	documentKey: string;
	discountAmount: number;
}

export interface AppliedCouponItemDiscountDto {
	cartItemId: string;
	translationItemId: string;
	itemDiscountTotal: number;
	documents: AppliedCouponDocumentDiscountDto[];
}

export interface AppliedCouponDto {
	couponId: string;
	code: string;
	discountType: "percent" | "fixed";
	discountValue: number;
	appliesTo: "base" | "total";
	applicableSubtotal: number;
	discountAmount: number;
	itemDiscounts: AppliedCouponItemDiscountDto[];
}

export interface CartDto {
	cartId: string;
	items: CartItemDto[];
	cartSum: number;
	cartSumWithDiscount: number;
	appliedCoupon: AppliedCouponDto | null;
}

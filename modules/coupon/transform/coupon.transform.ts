import { PaginationResult } from "../../../shared/utils/pagination.util";
import { TranslationItemDocument } from "../../translation/translationItem/model/translationItem.mode";
import { CouponDto } from "../dto/coupon.dto";
import { CouponDocument } from "../model/coupon.model";

export default class CouponTransform {
	coupon(doc: CouponDocument): CouponDto {
		const items = (doc.applicableTranslationItems ?? []) as any[];
		const transformedItems = items.map((p) => {
			if (p && typeof p === "object" && p?._id) {
				const ti = p as TranslationItemDocument;
				return {
					translationItemId: (ti._id as any)?.toString() ?? "",
					title: ti.title ?? "",
				};
			}
			return p?.toString?.() ?? p;
		});

		return {
			couponId: (doc._id as any)?.toString() ?? "",
			code: doc.code,
			discountType: doc.discountType,
			discountValue: doc.discountValue,
			maxDiscountAmount: doc.maxDiscountAmount ?? null,
			minPurchaseAmount: doc.minPurchaseAmount ?? null,
			startDate: doc.startDate ?? null,
			endDate: doc.endDate ?? null,
			usageLimit: doc.usageLimit ?? null,
			usedCount: doc.usedCount ?? 0,
			perUserLimit: doc.perUserLimit ?? null,
			isActive: doc.isActive,
			description: doc.description ?? "",
			appliesTo: doc.appliesTo,
			applicableTranslationItems: transformedItems,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	}

	coupons(docs: CouponDocument[]): CouponDto[] {
		return docs.map((d) => this.coupon(d));
	}

	paginatedCoupons(paginated: PaginationResult<CouponDocument>) {
		return {
			...paginated,
			elements: paginated.elements.map((item) => this.coupon(item)),
		};
	}
}

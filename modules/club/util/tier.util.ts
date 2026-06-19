export enum ClubTier {
	NORMAL = "normal",
	BRONZE = "bronze",
	SILVER = "silver",
	GOLD = "gold",
}

export interface ClubThresholds {
	bronzeMinScore: number;
	silverMinScore: number;
	goldMinScore: number;
	bronzeDiscount: number;
	silverDiscount: number;
	goldDiscount: number;
}

export interface TierInfo {
	tier: ClubTier;
	/** درصد تخفیف مبلغ ترجمه برای این سطح (۰ برای معمولی) */
	discountPercent: number;
	/** کف امتیازِ سطح فعلی */
	currentMinScore: number;
	/** سطح بعدی (در صورت وجود) */
	nextTier: ClubTier | null;
	/** امتیاز لازم برای رسیدن به سطح بعدی (null اگر بالاترین سطح) */
	nextTierMinScore: number | null;
}

/** سطح کاربر و تخفیفِ آن را از روی امتیاز و آستانه‌های پیکربندی محاسبه می‌کند. */
export function deriveTier(score: number, c: ClubThresholds): TierInfo {
	if (score >= c.goldMinScore) {
		return { tier: ClubTier.GOLD, discountPercent: c.goldDiscount, currentMinScore: c.goldMinScore, nextTier: null, nextTierMinScore: null };
	}
	if (score >= c.silverMinScore) {
		return { tier: ClubTier.SILVER, discountPercent: c.silverDiscount, currentMinScore: c.silverMinScore, nextTier: ClubTier.GOLD, nextTierMinScore: c.goldMinScore };
	}
	if (score >= c.bronzeMinScore) {
		return { tier: ClubTier.BRONZE, discountPercent: c.bronzeDiscount, currentMinScore: c.bronzeMinScore, nextTier: ClubTier.SILVER, nextTierMinScore: c.silverMinScore };
	}
	return { tier: ClubTier.NORMAL, discountPercent: 0, currentMinScore: 0, nextTier: ClubTier.BRONZE, nextTierMinScore: c.bronzeMinScore };
}

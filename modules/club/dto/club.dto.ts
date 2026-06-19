import { ClubTier } from "../util/tier.util";

export interface UpdateClubConfigDto {
	bronzeMinScore: number;
	silverMinScore: number;
	goldMinScore: number;
	bronzeDiscount: number;
	silverDiscount: number;
	goldDiscount: number;
}

export interface ClubConfigDto {
	bronzeMinScore: number;
	silverMinScore: number;
	goldMinScore: number;
	bronzeDiscount: number;
	silverDiscount: number;
	goldDiscount: number;
}

export interface ClubStatusDto {
	score: number;
	tier: ClubTier;
	discountPercent: number;
	currentMinScore: number;
	nextTier: ClubTier | null;
	nextTierMinScore: number | null;
	pointsToNextTier: number | null;
	config: ClubConfigDto;
}

export interface ScoreTransactionDto {
	id: string;
	orderId: string | null;
	orderNumber: number | null;
	points: number;
	description: string;
	createdAt: Date;
}

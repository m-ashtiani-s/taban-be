import { PaginationResult } from "../../../shared/utils/pagination.util";
import { ClubConfigDto, ClubStatusDto, ScoreTransactionDto } from "../dto/club.dto";
import { ClubConfigDocument } from "../model/clubConfig.model";
import { ScoreTransactionDocument } from "../model/scoreTransaction.model";
import { deriveTier } from "../util/tier.util";

export default class ClubTransform {
	config(doc: ClubConfigDocument): ClubConfigDto {
		return {
			bronzeMinScore: doc.bronzeMinScore,
			silverMinScore: doc.silverMinScore,
			goldMinScore: doc.goldMinScore,
			bronzeDiscount: doc.bronzeDiscount,
			silverDiscount: doc.silverDiscount,
			goldDiscount: doc.goldDiscount,
		};
	}

	status(score: number, configDoc: ClubConfigDocument): ClubStatusDto {
		const config = this.config(configDoc);
		const info = deriveTier(score, config);
		return {
			score,
			tier: info.tier,
			discountPercent: info.discountPercent,
			currentMinScore: info.currentMinScore,
			nextTier: info.nextTier,
			nextTierMinScore: info.nextTierMinScore,
			pointsToNextTier: info.nextTierMinScore === null ? null : Math.max(info.nextTierMinScore - score, 0),
			config,
		};
	}

	transaction(doc: ScoreTransactionDocument): ScoreTransactionDto {
		return {
			id: (doc._id as any)?.toString() ?? "",
			orderId: (doc.order as any)?.toString?.() ?? null,
			orderNumber: doc.orderNumber ?? null,
			points: doc.points,
			description: doc.description ?? "",
			createdAt: doc.createdAt,
		};
	}

	transactions(docs: ScoreTransactionDocument[]): ScoreTransactionDto[] {
		return docs.map((d) => this.transaction(d));
	}

	paginatedTransactions(paginated: PaginationResult<ScoreTransactionDocument>) {
		return {
			...paginated,
			elements: paginated.elements.map((item) => this.transaction(item)),
		};
	}
}

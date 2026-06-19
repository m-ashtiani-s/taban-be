import mongoose, { PaginateResult } from "mongoose";
import ScoreTransactionModel, { ScoreTransactionDocument } from "../model/scoreTransaction.model";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class ScoreTransactionRepository {
	async create(data: Partial<ScoreTransactionDocument>, session?: mongoose.ClientSession): Promise<ScoreTransactionDocument> {
		const tx = new ScoreTransactionModel(data);
		return tx.save({ session });
	}

	async findOneByOrder(orderId: string, session?: mongoose.ClientSession): Promise<ScoreTransactionDocument | null> {
		let query = ScoreTransactionModel.findOne({ order: orderId });
		if (session) query = query.session(session);
		return query.exec();
	}

	async findPaginatedByUser(userId: string, pagination: PaginationInput): Promise<PaginationResult<ScoreTransactionDocument>> {
		const res: PaginateResult<ScoreTransactionDocument> = await ScoreTransactionModel.paginate(
			{ user: userId },
			{ page: pagination.page, limit: pagination.limit, sort: pagination.sort }
		);
		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}
}

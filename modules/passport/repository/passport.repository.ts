import { PaginateResult } from "mongoose";
import PassportModel, { PassportDocument } from "../model/passport.model";
import { CreatePassportDto } from "../dto/passport.dto";
import { PassportFilters } from "../dto/passportFilters.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class PassportRepository {
	async findByIdAndUser(passportId: string, userId: string): Promise<PassportDocument | null> {
		return PassportModel.findOne({ _id: passportId, user: userId }).exec();
	}

	async findPaginatedByUser(
		userId: string,
		filters: PassportFilters,
		pagination: PaginationInput
	): Promise<PaginationResult<PassportDocument>> {
		const query: any = { user: userId };

		if (filters.term) {
			query.title = { $regex: filters.term, $options: "i" };
		}
		if (filters.isActive !== undefined) {
			query.isActive = filters.isActive;
		}

		const res: PaginateResult<PassportDocument> = await PassportModel.paginate(query, {
			page: pagination.page,
			limit: pagination.limit,
			sort: pagination.sort,
		});

		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}

	async create(userId: string, data: CreatePassportDto): Promise<PassportDocument> {
		const passport = new PassportModel({ ...data, user: userId });
		return passport.save();
	}

	async setActiveStatusByUser(
		passportId: string,
		userId: string,
		isActive: boolean
	): Promise<PassportDocument | null> {
		return PassportModel.findOneAndUpdate({ _id: passportId, user: userId }, { isActive }, { new: true }).exec();
	}
}

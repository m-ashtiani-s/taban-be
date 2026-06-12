import { PaginateResult } from "mongoose";
import PassportModel, { PassportDocument } from "../model/passport.model";
import { PassportFilters } from "../dto/passportFilters.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class AdminPassportRepository {
	async findById(passportId: string, populateFields?: string[]): Promise<PassportDocument | null> {
		let query = PassportModel.findById(passportId);
		if (populateFields && populateFields.length > 0) {
			populateFields.forEach((field) => {
				query = query.populate(field);
			});
		}
		return query.exec();
	}

	async findPaginated(
		filters: PassportFilters,
		pagination: PaginationInput,
		populateFields?: string[]
	): Promise<PaginationResult<PassportDocument>> {
		const query: any = {};

		if (filters.term) {
			query.title = { $regex: filters.term, $options: "i" };
		}
		if (filters.isActive !== undefined) {
			query.isActive = filters.isActive;
		}
		if (filters.userId !== undefined) {
			query.user = filters.userId;
		}

		const res: PaginateResult<PassportDocument> = await PassportModel.paginate(query, {
			page: pagination.page,
			limit: pagination.limit,
			sort: pagination.sort,
			populate: populateFields ?? [],
		});

		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}

	async setActiveStatus(passportId: string, isActive: boolean): Promise<PassportDocument | null> {
		return PassportModel.findByIdAndUpdate(passportId, { isActive }, { new: true }).exec();
	}
}

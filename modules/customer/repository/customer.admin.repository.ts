import { PaginateResult } from "mongoose";
import CustomerModel, { CustomerDocument } from "../model/customer.model";
import { AdminCustomerFilters } from "../dto/customer.admin.dto";
import { UpdateCustomerDto } from "../dto/customer.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class AdminCustomerRepository {
	async findById(customerId: string): Promise<CustomerDocument | null> {
		return CustomerModel.findById(customerId).populate("enterprise").exec();
	}

	async findPaginated(
		filters: AdminCustomerFilters,
		pagination: PaginationInput
	): Promise<PaginationResult<CustomerDocument>> {
		const query: any = {};

		if (filters.enterpriseId) query.enterprise = filters.enterpriseId;
		if (filters.provinceCode !== undefined) query.provinceCode = filters.provinceCode;
		if (filters.cityCode !== undefined) query.cityCode = filters.cityCode;
		if (filters.isActive !== undefined) query.isActive = filters.isActive;

		if (filters.term) {
			query.$or = [
				{ firstName: { $regex: filters.term, $options: "i" } },
				{ lastName: { $regex: filters.term, $options: "i" } },
				{ nationalId: { $regex: filters.term, $options: "i" } },
				{ phoneNumber: { $regex: filters.term, $options: "i" } },
			];
		}

		const res: PaginateResult<CustomerDocument> = await CustomerModel.paginate(query, {
			page: pagination.page,
			limit: pagination.limit,
			sort: pagination.sort,
			populate: "enterprise",
		});

		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}

	async updateById(customerId: string, data: Partial<UpdateCustomerDto>): Promise<CustomerDocument | null> {
		return CustomerModel.findByIdAndUpdate(customerId, { $set: data }, { new: true, runValidators: true })
			.populate("enterprise")
			.exec();
	}

	async setActiveStatus(customerId: string, isActive: boolean): Promise<CustomerDocument | null> {
		return CustomerModel.findByIdAndUpdate(customerId, { $set: { isActive } }, { new: true })
			.populate("enterprise")
			.exec();
	}
}

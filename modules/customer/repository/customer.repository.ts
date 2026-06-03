import { PaginateResult } from "mongoose";
import CustomerModel, { CustomerDocument } from "../model/customer.model";
import { CreateCustomerDto, CustomerFilters, UpdateCustomerDto } from "../dto/customer.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class CustomerRepository {
	async findByIdAndEnterprise(customerId: string, enterpriseId: string): Promise<CustomerDocument | null> {
		return CustomerModel.findOne({ _id: customerId, enterprise: enterpriseId }).exec();
	}

	async findPaginatedByEnterprise(
		enterpriseId: string,
		filters: CustomerFilters,
		pagination: PaginationInput
	): Promise<PaginationResult<CustomerDocument>> {
		const query: any = { enterprise: enterpriseId };

		if (filters.term) {
			query.$or = [
				{ firstName: { $regex: filters.term, $options: "i" } },
				{ lastName: { $regex: filters.term, $options: "i" } },
				{ nationalId: { $regex: filters.term, $options: "i" } },
				{ phoneNumber: { $regex: filters.term, $options: "i" } },
			];
		}
		if (filters.provinceCode !== undefined) query.provinceCode = filters.provinceCode;
		if (filters.cityCode !== undefined) query.cityCode = filters.cityCode;
		if (filters.isActive !== undefined) query.isActive = filters.isActive;

		const res: PaginateResult<CustomerDocument> = await CustomerModel.paginate(query, {
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

	async create(enterpriseId: string, data: CreateCustomerDto): Promise<CustomerDocument> {
		const customer = new CustomerModel({ ...data, enterprise: enterpriseId });
		return customer.save();
	}

	async updateByIdAndEnterprise(
		customerId: string,
		enterpriseId: string,
		data: Partial<UpdateCustomerDto>
	): Promise<CustomerDocument | null> {
		return CustomerModel.findOneAndUpdate(
			{ _id: customerId, enterprise: enterpriseId },
			{ $set: data },
			{ new: true, runValidators: true }
		).exec();
	}

	async setActiveStatus(
		customerId: string,
		enterpriseId: string,
		isActive: boolean
	): Promise<CustomerDocument | null> {
		return CustomerModel.findOneAndUpdate(
			{ _id: customerId, enterprise: enterpriseId },
			{ isActive },
			{ new: true }
		).exec();
	}
}

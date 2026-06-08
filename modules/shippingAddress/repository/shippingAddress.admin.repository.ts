import { PaginateResult } from "mongoose";
import ShippingAddressModel, { ShippingAddressDocument } from "../model/shippingAddress.model";
import { ShippingAddressFilters, UpdateShippingAddressDto } from "../dto/shippingAddress.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class AdminShippingAddressRepository {
	async findById(shippingAddressId: string, populateFields?: string[]): Promise<ShippingAddressDocument | null> {
		let query = ShippingAddressModel.findById(shippingAddressId);
		if (populateFields && populateFields.length > 0) {
			populateFields.forEach((field) => {
				query = query.populate(field);
			});
		}
		return query.exec();
	}

	async findPaginated(
		filters: ShippingAddressFilters,
		pagination: PaginationInput,
		populateFields?: string[]
	): Promise<PaginationResult<ShippingAddressDocument>> {
		const query: any = {};

		if (filters.term) {
			query.$or = [
				{ title: { $regex: filters.term, $options: "i" } },
				{ fullAddress: { $regex: filters.term, $options: "i" } },
			];
		}
		if (filters.provinceCode !== undefined) {
			query.provinceCode = filters.provinceCode;
		}
		if (filters.cityCode !== undefined) {
			query.cityCode = filters.cityCode;
		}
		if (filters.isActive !== undefined) {
			query.isActive = filters.isActive;
		}
		if (filters.userId !== undefined) {
			query.user = filters.userId;
		}

		const res: PaginateResult<ShippingAddressDocument> = await ShippingAddressModel.paginate(query, {
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

	async updateById(
		shippingAddressId: string,
		data: Partial<UpdateShippingAddressDto>
	): Promise<ShippingAddressDocument | null> {
		return ShippingAddressModel.findByIdAndUpdate(
			shippingAddressId,
			{ $set: data },
			{ new: true, runValidators: true }
		).exec();
	}

	async setActiveStatus(shippingAddressId: string, isActive: boolean): Promise<ShippingAddressDocument | null> {
		return ShippingAddressModel.findByIdAndUpdate(shippingAddressId, { isActive }, { new: true }).exec();
	}
}

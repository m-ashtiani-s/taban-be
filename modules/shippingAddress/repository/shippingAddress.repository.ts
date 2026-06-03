import { PaginateResult } from "mongoose";
import ShippingAddressModel, { ShippingAddressDocument } from "../model/shippingAddress.model";
import { CreateShippingAddressDto, ShippingAddressFilters, UpdateShippingAddressDto } from "../dto/shippingAddress.dto";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";

export default class ShippingAddressRepository {
	async findByIdAndUser(shippingAddressId: string, userId: string): Promise<ShippingAddressDocument | null> {
		return ShippingAddressModel.findOne({ _id: shippingAddressId, user: userId }).exec();
	}

	async findPaginatedByUser(
		userId: string,
		filters: ShippingAddressFilters,
		pagination: PaginationInput
	): Promise<PaginationResult<ShippingAddressDocument>> {
		const query: any = { user: userId };

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

		const res: PaginateResult<ShippingAddressDocument> = await ShippingAddressModel.paginate(query, {
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

	async create(userId: string, data: CreateShippingAddressDto): Promise<ShippingAddressDocument> {
		const shippingAddress = new ShippingAddressModel({ ...data, user: userId });
		return shippingAddress.save();
	}

	async updateByIdAndUser(
		shippingAddressId: string,
		userId: string,
		data: Partial<UpdateShippingAddressDto>
	): Promise<ShippingAddressDocument | null> {
		return ShippingAddressModel.findOneAndUpdate(
			{ _id: shippingAddressId, user: userId },
			{ $set: data },
			{ new: true, runValidators: true }
		).exec();
	}

	async setActiveStatusByUser(
		shippingAddressId: string,
		userId: string,
		isActive: boolean
	): Promise<ShippingAddressDocument | null> {
		return ShippingAddressModel.findOneAndUpdate(
			{ _id: shippingAddressId, user: userId },
			{ isActive },
			{ new: true }
		).exec();
	}
}

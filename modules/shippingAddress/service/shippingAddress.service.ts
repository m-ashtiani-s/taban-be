import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import { CreateShippingAddressDto, UpdateShippingAddressDto } from "../dto/shippingAddress.dto";
import { ShippingAddressFilters } from "../dto/shippingAddressFilters.dto";
import ShippingAddressRepository from "../repository/shippingAddress.repository";
import ShippingAddressTransform from "../transform/shippingAddress.transform";

export default class ShippingAddressService {
	private shippingAddressRepository = new ShippingAddressRepository();
	private shippingAddressTransform = new ShippingAddressTransform();

	async createShippingAddress(userId: string, createShippingAddressData: CreateShippingAddressDto) {
		const shippingAddress = await this.shippingAddressRepository.create(userId, createShippingAddressData);
		return {
			field: "createShippingAddress",
			success: true,
			message: "آدرس با موفقیت ایجاد شد",
			data: this.shippingAddressTransform.shippingAddress(shippingAddress),
		};
	}

	async getShippingAddresses(
		userId: string,
		filters: ShippingAddressFilters,
		page: string,
		pageSize: string,
		sortOrders: string
	) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.shippingAddressRepository.findPaginatedByUser(userId, filters, pagination.getOptions());
		return {
			field: "getShippingAddresses",
			success: true,
			message: "لیست آدرس‌ها با موفقیت دریافت شد",
			data: this.shippingAddressTransform.paginatedShippingAddresses(paginated),
		};
	}

	async getShippingAddressById(userId: string, shippingAddressId: string) {
		const shippingAddress = await this.shippingAddressRepository.findByIdAndUser(shippingAddressId, userId);
		if (!shippingAddress) throw new NotFoundError("آدرس یافت نشد");
		return {
			field: "getShippingAddressById",
			success: true,
			message: "آدرس با موفقیت دریافت شد",
			data: this.shippingAddressTransform.shippingAddress(shippingAddress),
		};
	}

	async updateShippingAddress(userId: string, shippingAddressId: string, UpdateShippingAddressData: UpdateShippingAddressDto) {
		const shippingAddress = await this.shippingAddressRepository.findByIdAndUser(shippingAddressId, userId);
		if (!shippingAddress) throw new NotFoundError("آدرس یافت نشد");
		const updated = await this.shippingAddressRepository.updateByIdAndUser(shippingAddressId, userId, UpdateShippingAddressData);
		if (!updated) throw new BadRequestError("ویرایش آدرس با خطا مواجه شد");

		return {
			field: "updateShippingAddress",
			success: true,
			message: "آدرس با موفقیت ویرایش شد",
			data: this.shippingAddressTransform.shippingAddress(updated),
		};
	}

	async activateShippingAddress(userId: string, shippingAddressId: string) {
		const shippingAddress = await this.shippingAddressRepository.findByIdAndUser(shippingAddressId, userId);
		if (!shippingAddress) throw new NotFoundError("آدرس یافت نشد");
		if (shippingAddress.isActive) throw new BadRequestError("آدرس از قبل فعال است");

		await this.shippingAddressRepository.setActiveStatusByUser(shippingAddressId, userId, true);
		return {
			field: "activateShippingAddress",
			success: true,
			message: "آدرس با موفقیت فعال شد",
			data: null,
		};
	}

	async deactivateShippingAddress(userId: string, shippingAddressId: string) {
		const shippingAddress = await this.shippingAddressRepository.findByIdAndUser(shippingAddressId, userId);
		if (!shippingAddress) throw new NotFoundError("آدرس یافت نشد");
		if (!shippingAddress.isActive) throw new BadRequestError("آدرس از قبل غیرفعال است");

		await this.shippingAddressRepository.setActiveStatusByUser(shippingAddressId, userId, false);
		return {
			field: "deactivateShippingAddress",
			success: true,
			message: "آدرس با موفقیت غیرفعال شد",
			data: null,
		};
	}
}

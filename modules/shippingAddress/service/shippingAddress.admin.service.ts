import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import { ShippingAddressFilters, UpdateShippingAddressDto } from "../dto/shippingAddress.dto";
import AdminShippingAddressRepository from "../repository/shippingAddress.admin.repository";
import AdminShippingAddressTransform from "../transform/shippingAddress.admin.transform";

export default class AdminShippingAddressService {
	private shippingAddressRepository = new AdminShippingAddressRepository();
	private shippingAddressTransform = new AdminShippingAddressTransform();

	async getShippingAddresses(filters: ShippingAddressFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.shippingAddressRepository.findPaginated(filters, pagination.getOptions(), ["user"]);
		return {
			field: "getShippingAddresses",
			success: true,
			message: "لیست آدرس‌ها با موفقیت دریافت شد",
			data: this.shippingAddressTransform.paginatedShippingAddresses(paginated),
		};
	}

	async getShippingAddressById(shippingAddressId: string) {
		const shippingAddress = await this.shippingAddressRepository.findById(shippingAddressId, ["user"]);
		if (!shippingAddress) throw new NotFoundError("آدرس یافت نشد");
		return {
			field: "getShippingAddressById",
			success: true,
			message: "آدرس با موفقیت دریافت شد",
			data: this.shippingAddressTransform.shippingAddress(shippingAddress),
		};
	}

	async updateShippingAddress(shippingAddressId: string, updateShippingAddressData: UpdateShippingAddressDto) {
		const shippingAddress = await this.shippingAddressRepository.findById(shippingAddressId);
		if (!shippingAddress) throw new NotFoundError("آدرس یافت نشد");
		const updated = await this.shippingAddressRepository.updateById(shippingAddressId, updateShippingAddressData);
		if (!updated) throw new BadRequestError("ویرایش آدرس با خطا مواجه شد");

		const populated = await this.shippingAddressRepository.findById(shippingAddressId, ["user"]);
		return {
			field: "updateShippingAddress",
			success: true,
			message: "آدرس با موفقیت ویرایش شد",
			data: this.shippingAddressTransform.shippingAddress(populated!),
		};
	}

	async activateShippingAddress(shippingAddressId: string) {
		const shippingAddress = await this.shippingAddressRepository.findById(shippingAddressId);
		if (!shippingAddress) throw new NotFoundError("آدرس یافت نشد");
		if (shippingAddress.isActive) throw new BadRequestError("آدرس از قبل فعال است");

		await this.shippingAddressRepository.setActiveStatus(shippingAddressId, true);
		return {
			field: "activateShippingAddress",
			success: true,
			message: "آدرس با موفقیت فعال شد",
			data: null,
		};
	}

	async deactivateShippingAddress(shippingAddressId: string) {
		const shippingAddress = await this.shippingAddressRepository.findById(shippingAddressId);
		if (!shippingAddress) throw new NotFoundError("آدرس یافت نشد");
		if (!shippingAddress.isActive) throw new BadRequestError("آدرس از قبل غیرفعال است");

		await this.shippingAddressRepository.setActiveStatus(shippingAddressId, false);
		return {
			field: "deactivateShippingAddress",
			success: true,
			message: "آدرس با موفقیت غیرفعال شد",
			data: null,
		};
	}
}

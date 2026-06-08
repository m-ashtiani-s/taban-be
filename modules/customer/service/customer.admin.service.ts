import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import { AdminCustomerFilters } from "../dto/customer.admin.dto";
import { UpdateCustomerDto } from "../dto/customer.dto";
import AdminCustomerRepository from "../repository/customer.admin.repository";
import AdminCustomerTransform from "../transform/customer.admin.transform";

export default class AdminCustomerService {
	private customerRepository = new AdminCustomerRepository();
	private customerTransform = new AdminCustomerTransform();

	async getCustomers(filters: AdminCustomerFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.customerRepository.findPaginated(filters, pagination.getOptions());
		return {
			field: "getCustomers",
			success: true,
			message: "لیست مشتریان با موفقیت دریافت شد",
			data: this.customerTransform.paginatedCustomers(paginated),
		};
	}

	async getCustomerById(customerId: string) {
		const customer = await this.customerRepository.findById(customerId);
		if (!customer) throw new NotFoundError("مشتری یافت نشد");
		return {
			field: "getCustomerById",
			success: true,
			message: "مشتری با موفقیت دریافت شد",
			data: this.customerTransform.customer(customer),
		};
	}

	async updateCustomer(customerId: string, updateCustomerData: UpdateCustomerDto) {
		const customer = await this.customerRepository.findById(customerId);
		if (!customer) throw new NotFoundError("مشتری یافت نشد");

		const updated = await this.customerRepository.updateById(customerId, updateCustomerData);
		if (!updated) throw new BadRequestError("ویرایش مشتری با خطا مواجه شد");

		return {
			field: "updateCustomer",
			success: true,
			message: "مشتری با موفقیت ویرایش شد",
			data: this.customerTransform.customer(updated),
		};
	}

	async activateCustomer(customerId: string) {
		const customer = await this.customerRepository.findById(customerId);
		if (!customer) throw new NotFoundError("مشتری یافت نشد");
		if (customer.isActive) throw new BadRequestError("مشتری از قبل فعال است");
		await this.customerRepository.setActiveStatus(customerId, true);
		return {
			field: "activateCustomer",
			success: true,
			message: "مشتری با موفقیت فعال شد",
			data: null,
		};
	}

	async deactivateCustomer(customerId: string) {
		const customer = await this.customerRepository.findById(customerId);
		if (!customer) throw new NotFoundError("مشتری یافت نشد");
		if (!customer.isActive) throw new BadRequestError("مشتری از قبل غیرفعال است");
		await this.customerRepository.setActiveStatus(customerId, false);
		return {
			field: "deactivateCustomer",
			success: true,
			message: "مشتری با موفقیت غیرفعال شد",
			data: null,
		};
	}
}

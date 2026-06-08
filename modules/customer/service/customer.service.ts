import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import { CreateCustomerDto, UpdateCustomerDto } from "../dto/customer.dto";
import { CustomerFilters } from "../dto/customerFilters.dto";
import CustomerRepository from "../repository/customer.repository";
import CustomerTransform from "../transform/customer.transform";

export default class CustomerService {
	private customerRepository = new CustomerRepository();
	private customerTransform = new CustomerTransform();

	async getCustomers(enterpriseId: string, filters: CustomerFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.customerRepository.findPaginatedByEnterprise(enterpriseId, filters, pagination.getOptions());
		return {
			field: "getCustomers",
			success: true,
			message: "لیست مشتریان با موفقیت دریافت شد",
			data: this.customerTransform.paginatedCustomers(paginated),
		};
	}

	async getCustomerById(enterpriseId: string, customerId: string) {
		const customer = await this.customerRepository.findByIdAndEnterprise(customerId, enterpriseId);
		if (!customer) throw new NotFoundError("مشتری یافت نشد");
		return {
			field: "getCustomerById",
			success: true,
			message: "مشتری با موفقیت دریافت شد",
			data: this.customerTransform.customer(customer),
		};
	}

	async createCustomer(enterpriseId: string, customerData: CreateCustomerDto) {
		const customer = await this.customerRepository.create(enterpriseId, customerData);
		return {
			field: "createCustomer",
			success: true,
			message: "مشتری با موفقیت ایجاد شد",
			data: this.customerTransform.customer(customer),
		};
	}

	async updateCustomer(enterpriseId: string, customerId: string, updateCustomerData: UpdateCustomerDto) {
		const customer = await this.customerRepository.findByIdAndEnterprise(customerId, enterpriseId);
		if (!customer) throw new NotFoundError("مشتری یافت نشد");

		const updated = await this.customerRepository.updateByIdAndEnterprise(customerId, enterpriseId, updateCustomerData);
		if (!updated) throw new BadRequestError("ویرایش مشتری با خطا مواجه شد");

		return {
			field: "updateCustomer",
			success: true,
			message: "مشتری با موفقیت ویرایش شد",
			data: this.customerTransform.customer(updated),
		};
	}

	async activateCustomer(enterpriseId: string, customerId: string) {
		const customer = await this.customerRepository.findByIdAndEnterprise(customerId, enterpriseId);
		if (!customer) throw new NotFoundError("مشتری یافت نشد");
		if (customer.isActive) throw new BadRequestError("مشتری از قبل فعال است");

		await this.customerRepository.setActiveStatus(customerId, enterpriseId, true);
		return {
			field: "activateCustomer",
			success: true,
			message: "مشتری با موفقیت فعال شد",
			data: null,
		};
	}

	async deactivateCustomer(enterpriseId: string, customerId: string) {
		const customer = await this.customerRepository.findByIdAndEnterprise(customerId, enterpriseId);
		if (!customer) throw new NotFoundError("مشتری یافت نشد");
		if (!customer.isActive) throw new BadRequestError("مشتری از قبل غیرفعال است");

		await this.customerRepository.setActiveStatus(customerId, enterpriseId, false);
		return {
			field: "deactivateCustomer",
			success: true,
			message: "مشتری با موفقیت غیرفعال شد",
			data: null,
		};
	}
}

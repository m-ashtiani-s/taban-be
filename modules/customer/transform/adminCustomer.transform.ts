import { PaginationResult } from "../../../shared/utils/pagination.util";
import { UserDocument } from "../../user/model/user.model";
import { AdminCustomerDto, AdminCustomerEnterpriseInfo } from "../dto/adminCustomer.dto";
import { CustomerDocument } from "../model/customer.model";

export default class AdminCustomerTransform {
	private enterpriseInfo(enterprise: CustomerDocument["enterprise"]): AdminCustomerEnterpriseInfo | string | null {
		if (!enterprise) return null;
		if (typeof enterprise === "string") return enterprise;
		const u = enterprise as unknown as UserDocument;
		if (!u?._id) return null;
		const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
		return {
			userId: u._id as string,
			fullName,
			username: u.username ?? "",
			phoneNumber: u.phoneNumber ?? "",
		};
	}

	customer(doc: CustomerDocument): AdminCustomerDto {
		return {
			customerId: (doc._id as any)?.toString() ?? "",
			firstName: doc.firstName,
			lastName: doc.lastName,
			fullName: `${doc.firstName ?? ""} ${doc.lastName ?? ""}`.trim(),
			nationalId: doc.nationalId,
			phoneNumber: doc.phoneNumber,
			provinceName: doc.provinceName,
			provinceCode: doc.provinceCode,
			cityName: doc.cityName,
			cityCode: doc.cityCode,
			isActive: doc.isActive,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
			enterprise: this.enterpriseInfo(doc.enterprise),
		};
	}

	paginatedCustomers(paginated: PaginationResult<CustomerDocument>) {
		return {
			...paginated,
			elements: paginated.elements.map((item) => this.customer(item)),
		};
	}
}

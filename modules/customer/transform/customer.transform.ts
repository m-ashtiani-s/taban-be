import { PaginationResult } from "../../../shared/utils/pagination.util";
import { CustomerDto } from "../dto/customer.dto";
import { CustomerDocument } from "../model/customer.model";

export default class CustomerTransform {
	customer(doc: CustomerDocument): CustomerDto {
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
		};
	}

	customers(docs: CustomerDocument[]): CustomerDto[] {
		return docs.map((d) => this.customer(d));
	}

	paginatedCustomers(paginated: PaginationResult<CustomerDocument>) {
		return {
			...paginated,
			elements: paginated.elements.map((item) => this.customer(item)),
		};
	}
}

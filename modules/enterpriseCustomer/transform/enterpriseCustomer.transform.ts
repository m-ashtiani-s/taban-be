import { EnterpriseCustomerDto } from "../dto/enterpriseCustomer.dto";
import { EnterpriseCustomerDocument } from "../model/enterpriseCustomer.model";

export default class EnterpriseCustomerTransform {
	enterpriseCustomer(doc: EnterpriseCustomerDocument): EnterpriseCustomerDto {
		return {
			enterpriseCustomerId: (doc._id as any)?.toString() ?? "",
			institutionName: doc.institutionName,
			institutionAddress: doc.institutionAddress,
			registrationId: doc.registrationId ?? null,
			isActive: doc.isActive,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	}
}

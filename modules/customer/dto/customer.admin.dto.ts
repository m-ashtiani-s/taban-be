import { CustomerDto } from "./customer.dto";

export interface AdminCustomerEnterpriseInfo {
	userId: string;
	fullName: string;
	username: string;
	phoneNumber: string;
}

export interface AdminCustomerDto extends CustomerDto {
	enterprise: AdminCustomerEnterpriseInfo | string | null;
}

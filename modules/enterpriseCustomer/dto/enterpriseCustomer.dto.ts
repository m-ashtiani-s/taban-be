export interface CreateEnterpriseCustomerDto {
	institutionName: string;
	institutionAddress: string;
	registrationId?: string | null;
}

export interface EnterpriseCustomerDto {
	enterpriseCustomerId: string;
	institutionName: string;
	institutionAddress: string;
	registrationId: string | null;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateCustomerDto {
	firstName: string;
	lastName: string;
	nationalId: string;
	phoneNumber: string;
	provinceName: string;
	provinceCode: number;
	cityName: string;
	cityCode: number;
	isActive?: boolean;
}

export type UpdateCustomerDto = CreateCustomerDto;

export interface CustomerFilters {
	term?: string;
	provinceCode?: number;
	cityCode?: number;
	isActive?: boolean;
}

export interface CustomerDto {
	customerId: string;
	firstName: string;
	lastName: string;
	fullName: string;
	nationalId: string;
	phoneNumber: string;
	provinceName: string;
	provinceCode: number;
	cityName: string;
	cityCode: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

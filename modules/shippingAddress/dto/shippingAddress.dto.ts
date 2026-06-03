export interface CreateShippingAddressDto {
	title: string;
	provinceName: string;
	provinceCode: number;
	cityName: string;
	cityCode: number;
	plaque?: string | null;
	unit?: string | null;
	fullAddress: string;
	addressDescription?: string | null;
	landlineNumber?: string | null;
	isActive?: boolean;
}

export type UpdateShippingAddressDto = CreateShippingAddressDto;

export interface ShippingAddressFilters {
	term?: string;
	provinceCode?: number;
	cityCode?: number;
	isActive?: boolean;
	userId?: string;
}

export interface ShippingAddressUserInfo {
	userId: string;
	fullName: string;
	username: string;
	phoneNumber: string;
}

export interface ShippingAddressDto {
	shippingAddressId: string;
	title: string;
	provinceName: string;
	provinceCode: number;
	cityName: string;
	cityCode: number;
	plaque: string | null;
	unit: string | null;
	fullAddress: string;
	addressDescription: string | null;
	landlineNumber: string | null;
	isActive: boolean;
	user: ShippingAddressUserInfo | string | null;
	createdAt: Date;
	updatedAt: Date;
}

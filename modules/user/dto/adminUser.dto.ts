import { CustomerType, UserType } from "../model/user.model";

export interface AdminUserFilters {
	term?: string;
	customerType?: CustomerType;
	userType?: UserType;
	isActive?: boolean;
}

export interface AdminUpdateUserDto {
	firstName?: string;
	lastName?: string;
	nationalId?: string;
	phoneNumber?: string;
	profilePic?: string;
	userType?: UserType;
	customerType?: CustomerType;
	requiredLanguages?: string[];
	specialtyField?: string;
	referralSource?: string;
	isActive?: boolean;
}

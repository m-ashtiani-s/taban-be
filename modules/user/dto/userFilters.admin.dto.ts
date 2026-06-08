import { CustomerType, UserType } from "../model/user.model";

export interface AdminUserFilters {
	term?: string;
	customerType?: CustomerType;
	userType?: UserType;
	isActive?: boolean;
}

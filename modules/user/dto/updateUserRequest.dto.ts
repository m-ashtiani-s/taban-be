import { UserType } from "../model/user.model";

export interface UpdateUserRequestDto {
	profilePic?: string;
	nationalId?: string;
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	userType?: UserType;
	requiredLanguages?: string[];
	specialtyField?: string;
	referralSource?: string;
	referralCode?: string;
}

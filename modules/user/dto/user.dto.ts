import { LanguageDto } from "../../translation/language/dto/language.dto";
import { CustomerType, UserType } from "../model/user.model";

export interface UserDto {
	userId: string;
	username: string;
	role: string;
	profilePic?: string;
	isActive: boolean;
	customerType: CustomerType;
	firstName?: string;
	lastName?: string;
	fullName?: string;
	nationalId?: string;
	phoneNumber?: string;
	userType?: UserType | null;
	requiredLanguages?: LanguageDto[];
	specialtyField?: string;
	referralSource?: string;
	referralCode?: string;
	ownReferralCode?: string;
}

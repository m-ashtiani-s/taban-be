export interface UpdateUserRequestDto {
	profilePic: string;
	nationalId: string;
	firstName: string;
	lastName: string;
	birthDate: string;
	email: string;
	gender: string;
	province: number;
	city: number;
	referralSource: string;
}

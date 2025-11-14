export interface UserDto {
    userId:string
	username: string;
	role: string;
	profilePic?: string;
	isActive: boolean;
	firstName?: string;
	lastName?: string;
	birthDate?: string;
	email?: string;
	gender?: string;
	stateId?: number | null;
	stateName?: string;
	cityId?: number | null;
	cityName?: string;
	referralSource?: string;
}

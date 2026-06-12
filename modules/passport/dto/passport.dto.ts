export interface CreatePassportDto {
	title: string;
	image: string;
	isActive?: boolean;
}

export type UpdatePassportDto = CreatePassportDto;

export interface PassportUserInfo {
	userId: string;
	fullName: string;
	username: string;
	phoneNumber: string;
}

export interface PassportDto {
	passportId: string;
	title: string;
	image: string;
	isActive: boolean;
	user: PassportUserInfo | string | null;
	createdAt: Date;
	updatedAt: Date;
}

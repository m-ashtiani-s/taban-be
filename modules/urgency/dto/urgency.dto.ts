export interface UpdateUrgencyDto {
	translationMinDays: number;
	translationMaxDays: number;
	justiceMinDays: number;
	justiceMaxDays: number;
	mfaMinDays: number;
	mfaMaxDays: number;
}

export interface UrgencyDto {
	translationMinDays: number;
	translationMaxDays: number;
	justiceMinDays: number;
	justiceMaxDays: number;
	mfaMinDays: number;
	mfaMaxDays: number;
	updatedAt: Date;
}

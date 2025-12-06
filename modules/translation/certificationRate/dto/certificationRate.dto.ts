export interface CertificationRateDto {
	certificationRateId: string;
	translationItemId: string;
	translationItemName: string;
	translationItemIsActive:boolean;
	languageId: string;
	languageName: string;
	languageIsActive:boolean;
	mfaPrice: number;
	justicePrice: number;
}

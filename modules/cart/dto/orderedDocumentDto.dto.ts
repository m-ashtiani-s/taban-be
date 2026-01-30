export type OrderedDocumentDto = {
	translationItemId: string;
	languageId: string;
	translationItemCount: number;
	translationItemNames: Record<string, string>;
	baseRateCount: Record<string, string>;
	specialItems: {
		translationItemTitle: string;
		translationItemId: string;
		specials: SpecialItemsValue[];
	}[];
	justiceInquiriesItems: {
		translationItemTitle: string;
		translationItemId: string;
		justiceInquiries: JusticeInquiryValue[];
	}[];
	mfaCertification: {
		translationItemTitle: string;
		translationItemId: string;
		mfaCertification: CertificationItem | null;
	}[];
	justiceCertification: {
		translationItemTitle: string;
		translationItemId: string;
		justiceCertification: CertificationItem | null;
	}[];
	passports: string[];
	assets: string[];
	copyCount?: Record<string, number>;
};

export type SpecialItemsValue = {
	count:number;
	dynamicRateId: string;
};

export type CertificationItem = {
	price: number | string;
	certificationRateId:string
};

export type JusticeInquiryValue = {
	justiceInquiryRateId: string;
};

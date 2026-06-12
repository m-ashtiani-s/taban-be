export type RateCalculationDocumentDto = {
	documentKey: string;
	title: string;
	baseRateCount: number;
	specials: {
		dynamicRateId: string;
		count: number;
	}[];
	mfaCertificationRateId?: string | null;
	justiceCertificationRateId?: string | null;
	justiceInquiryRateIds: string[];
	embassyRateIds?: string[];
};

export type RateCalculationRequestDto = {
	translationItemId: string;
	languageId: string;
	documents: RateCalculationDocumentDto[];
};

export type RateCalculationSpecialLine = {
	dynamicRateId: string;
	label: string;
	unitPrice: number;
	count: number;
	total: number;
};

export type RateCalculationCertificationLine = {
	certificationRateId: string;
	price: number;
};

export type RateCalculationInquiryLine = {
	justiceInquiryRateId: string;
	justiceInquiryName: string;
	price: number;
};

export type RateCalculationEmbassyLine = {
	embassyRateId: string;
	embassyName: string;
	price: number;
};

export type RateCalculationDocumentBreakdown = {
	documentKey: string;
	title: string;
	base: {
		baseRateId: string;
		title: string;
		unitPrice: number;
		count: number;
		total: number;
	};
	specials: RateCalculationSpecialLine[];
	specialsTotal: number;
	/**
	 * مجموع هزینه‌ی ترجمه (نرخ پایه + ویژگی‌های داینامیک). در لایه‌ی ترنسفورم سبد محاسبه می‌شود
	 * تا فرانت بتواند آن را به‌صورت یک قلم «هزینه ترجمه» به کاربر نمایش دهد.
	 */
	translationTotal?: number;
	mfaCertification: RateCalculationCertificationLine | null;
	justiceCertification: RateCalculationCertificationLine | null;
	certificationsTotal: number;
	justiceInquiries: RateCalculationInquiryLine[];
	inquiriesTotal: number;
	embassyApprovals: RateCalculationEmbassyLine[];
	embassyTotal: number;
	documentTotal: number;
};

export type RateCalculationSummary = {
	translationPrice: number;
	certificationPrice: number;
	inquiryPrice: number;
	embassyPrice: number;
	subtotal: number;
	taxPercent: number;
	taxPrice: number;
	totalPrice: number;
};

export type RateCalculationResponseDto = {
	translationItemId: string;
	translationItemTitle: string;
	languageId: string;
	languageName: string;
	documents: RateCalculationDocumentBreakdown[];
	summary: RateCalculationSummary;
};

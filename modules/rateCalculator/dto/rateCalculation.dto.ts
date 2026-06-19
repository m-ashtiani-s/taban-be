export type RateCalculationDocumentDto = {
	documentKey: string;
	title: string;
	baseRateCount: number;
	copyCount?: number;
	specials: {
		dynamicRateId: string;
		count: number;
	}[];
	mfaCertificationRateId?: string | null;
	justiceCertificationRateId?: string | null;
	justiceInquiryRateIds: string[];
	embassyRateIds?: string[];
	/** شناسه‌ی نرخ اسکن در صورت انتخاب اسکن برای این مدرک */
	scanRateId?: string | null;
	/** فایل‌های آپلودشده‌ی این مدرک (به‌صورت مجزا برای هر مدرک نگه‌داری می‌شود) */
	assets?: string[];
	/**
	 * کاربر استعلام‌های این مدرک را خودش تهیه می‌کند (استعلام‌های پولیِ ما برای این مدرک
	 * انتخاب نمی‌شوند و کاربر بعداً نتیجه را در جزئیات سفارش آپلود می‌کند).
	 */
	selfInquiry?: boolean;
};

export type RateCalculationRequestDto = {
	translationItemId: string;
	languageId: string;
	documents: RateCalculationDocumentDto[];
	/** ترجمه رسمی است یا خیر. اگر false باشد، سنام و مهر مترجم از نرخ پایه حذف می‌شوند. پیش‌فرض: true */
	isOfficial?: boolean;
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

export type RateCalculationScanLine = {
	scanRateId: string;
	price: number;
};

export type RateCalculationDocumentBreakdown = {
	documentKey: string;
	title: string;
	copyCount: number;
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
	/** اطلاعات اسکن در صورت انتخاب برای این مدرک */
	scan: RateCalculationScanLine | null;
	documentTotal: number;
};

export type RateCalculationSummary = {
	translationPrice: number;
	certificationPrice: number;
	inquiryPrice: number;
	embassyPrice: number;
	/** مجموع هزینه‌ی اسکن برای همه‌ی مدارک */
	scanPrice: number;
	subtotal: number;
	taxPercent: number;
	taxPrice: number;
	totalPrice: number;
	/** تخفیف باشگاه مشتریان روی مبلغ ترجمه (پایه + داینامیک‌ها) — درصد و مبلغ کسرشده */
	tierDiscountPercent: number;
	tierDiscountAmount: number;
};

export type RateCalculationResponseDto = {
	translationItemId: string;
	translationItemTitle: string;
	languageId: string;
	languageName: string;
	documents: RateCalculationDocumentBreakdown[];
	summary: RateCalculationSummary;
};

const Config = {
	port: process.env.PORT || 8000,
	secret: process.env.SECRET_KEY as string,
	invoice: {
		// نرخ مالیات بر ارزش افزوده به‌صورت کسری (۰ یعنی ۰٪، ۰.۰۹ یعنی ۹٪). فعلاً صفر؛
		// از طریق متغیر محیطی INVOICE_VAT_RATE قابل تغییر است.
		vatRate: Number(process.env.INVOICE_VAT_RATE ?? 0),
	},
	// اطلاعات برند/فروشنده که در سربرگ فاکتورِ PDF نمایش داده می‌شود. مقادیر خالی در قالب پنهان می‌مانند.
	company: {
		name: process.env.COMPANY_NAME ?? "رسمی‌یاب",
		legalName: process.env.COMPANY_LEGAL_NAME ?? "",
		tagline: process.env.COMPANY_TAGLINE ?? "سامانه‌ی ثبت سفارش ترجمه‌ی رسمی",
		economicCode: process.env.COMPANY_ECONOMIC_CODE ?? "",
		nationalId: process.env.COMPANY_NATIONAL_ID ?? "",
		registrationNumber: process.env.COMPANY_REGISTRATION_NUMBER ?? "",
		phone: process.env.COMPANY_PHONE ?? "",
		email: process.env.COMPANY_EMAIL ?? "",
		website: process.env.COMPANY_WEBSITE ?? "",
		address: process.env.COMPANY_ADDRESS ?? "",
	},
};

export default Config;

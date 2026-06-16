const Config = {
	port: process.env.PORT || 8000,
	secret: process.env.SECRET_KEY as string,
	invoice: {
		// نرخ مالیات بر ارزش افزوده به‌صورت کسری (۰ یعنی ۰٪، ۰.۰۹ یعنی ۹٪). فعلاً صفر؛
		// از طریق متغیر محیطی INVOICE_VAT_RATE قابل تغییر است.
		vatRate: Number(process.env.INVOICE_VAT_RATE ?? 0),
	},
};

export default Config;

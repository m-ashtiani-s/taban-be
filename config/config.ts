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
	zarinpal: {
		// merchant_id از پنل زرین‌پال. حتماً از طریق env مقداردهی شود.
		merchantId: process.env.ZARINPAL_MERCHANT_ID || "",
		// در حالت پیش‌فرض sandbox روشن است تا پرداخت واقعی به‌اشتباه انجام نشود.
		// برای محیط تولید باید ZARINPAL_SANDBOX=false تنظیم شود.
		sandbox: process.env.ZARINPAL_SANDBOX !== "false",
		// واحد مبلغ ارسالی به درگاه: IRR = ریال، IRT = تومان. قیمت‌های سیستم به تومان است،
		// پس در حالت IRR مبلغ ×۱۰ می‌شود. پیش‌فرض ریال (سازگارترین حالت با درگاه).
		currency: (process.env.ZARINPAL_CURRENCY as "IRR" | "IRT") || "IRR",
		// آدرس پایه‌ی بکند برای ساخت callback_url که کاربر بعد از پرداخت به آن برمی‌گردد.
		callbackBase: process.env.PAYMENT_CALLBACK_BASE || "http://localhost:8000",
		// صفحه‌ی نتیجه‌ی پرداخت در فرانت که بکند بعد از verify کاربر را به آن هدایت می‌کند.
		frontendResultUrl: process.env.PAYMENT_FRONTEND_RESULT || "http://localhost:3001/payment/result",
	},
};

export default Config;

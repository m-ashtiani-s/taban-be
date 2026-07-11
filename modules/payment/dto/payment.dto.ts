export interface InitiatePaymentDto {
	orderId: string;
	// آدرس بازگشت در فرانت پس از پایان پرداخت (اختیاری — پیش‌فرض از config)
	backUrl?: string | null;
}

export interface InitiatePaymentResult {
	paymentId: string;
	authority: string;
	redirectUrl: string;
}

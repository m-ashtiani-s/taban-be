import axios from "axios";
import Config from "../../../config/config";

// پیاده‌سازی درگاه زرین‌پال بر اساس نسخه‌ی v4 مستندات رسمی:
//   request: POST {base}/request.json
//   startpay: GET  {startPay}/{authority}
//   verify:  POST {base}/verify.json
// در حالت sandbox از دامنه‌ی sandbox.zarinpal.com استفاده می‌شود.

const zp = Config.zarinpal;

const API_BASE = zp.sandbox ? "https://sandbox.zarinpal.com/pg/v4/payment" : "https://api.zarinpal.com/pg/v4/payment";
const START_PAY_BASE = zp.sandbox ? "https://sandbox.zarinpal.com/pg/StartPay/" : "https://www.zarinpal.com/pg/StartPay/";

export interface ZarinpalRequestInput {
	amount: number;
	description: string;
	callbackUrl: string;
	mobile?: string;
	email?: string;
}

export interface ZarinpalRequestResult {
	success: boolean;
	authority?: string;
	code?: number;
	message?: string;
}

export interface ZarinpalVerifyResult {
	success: boolean;
	code?: number;
	refId?: string;
	cardPan?: string;
	alreadyVerified?: boolean;
	message?: string;
}

export function getStartPayUrl(authority: string): string {
	return `${START_PAY_BASE}${authority}`;
}

// خطاهای زرین‌پال گاهی آبجکت { code, message } و گاهی آرایه‌اند؛ هر دو حالت را پوشش می‌دهیم.
function extractError(data: any): string {
	const errors = data?.errors;
	if (!errors) return "خطای نامشخص از درگاه پرداخت";
	if (Array.isArray(errors)) {
		return errors[0]?.message || errors[0]?.code?.toString() || "خطای درگاه پرداخت";
	}
	return errors?.message || errors?.code?.toString() || "خطای درگاه پرداخت";
}

export async function requestPayment(input: ZarinpalRequestInput): Promise<ZarinpalRequestResult> {
	try {
		const { data } = await axios.post(
			`${API_BASE}/request.json`,
			{
				merchant_id: zp.merchantId,
				amount: input.amount,
				currency: zp.currency,
				callback_url: input.callbackUrl,
				description: input.description,
				metadata: { mobile: input.mobile, email: input.email },
			},
			{ timeout: 20000, headers: { "Content-Type": "application/json", Accept: "application/json" } }
		);

		if (data?.data?.code === 100 && data?.data?.authority) {
			return { success: true, authority: data.data.authority, code: 100 };
		}
		return { success: false, code: data?.data?.code, message: extractError(data) };
	} catch (error: any) {
		const payload = error?.response?.data;
		return { success: false, message: payload ? extractError(payload) : error?.message || "عدم دسترسی به درگاه پرداخت" };
	}
}

export async function verifyPayment(params: { amount: number; authority: string }): Promise<ZarinpalVerifyResult> {
	try {
		const { data } = await axios.post(
			`${API_BASE}/verify.json`,
			{
				merchant_id: zp.merchantId,
				amount: params.amount,
				authority: params.authority,
			},
			{ timeout: 20000, headers: { "Content-Type": "application/json", Accept: "application/json" } }
		);

		const code = data?.data?.code;
		// 100 = پرداخت تایید شد، 101 = قبلاً تایید شده بود (idempotent)
		if (code === 100 || code === 101) {
			return {
				success: true,
				code,
				refId: data?.data?.ref_id != null ? String(data.data.ref_id) : undefined,
				cardPan: data?.data?.card_pan,
				alreadyVerified: code === 101,
			};
		}
		return { success: false, code, message: extractError(data) };
	} catch (error: any) {
		const payload = error?.response?.data;
		return { success: false, message: payload ? extractError(payload) : error?.message || "خطا در تایید پرداخت" };
	}
}

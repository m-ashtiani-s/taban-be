/**
 * تولید یک کد معرف تصادفی (بدون حروف/اعداد مبهم مثل O و 0).
 * یکتایی این کد باید توسط فراخواننده (با چک در دیتابیس) تضمین شود.
 */
export function generateReferralCode(length: number = 8): string {
	const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

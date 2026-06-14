import axios from "axios";

export async function sendOtpSms(receptor: string, token: number): Promise<void> {
	const apiKey = process.env.KAVENEGAR_API_KEY;
	const template = process.env.KAVENEGAR_TEMPLATE;

	try {
		const response = await axios.get(`https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`, {
			params: { receptor, token, template },
		});
		console.log("[Kavenegar] OTP sent:", JSON.stringify(response.data));
	} catch (error: any) {
		console.error("[Kavenegar] Failed to send OTP:", error?.response?.data ?? error?.message);
		throw error;
	}
}

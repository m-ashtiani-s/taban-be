import otpModel, { OTPDocument } from "../model/otpModel";

export default class OtpRepository {
	async findByOtpId(otpId: string): Promise<OTPDocument | null> {
		return otpModel.findOne({ otpId });
	}

	async createOtp(data: Partial<OTPDocument>): Promise<OTPDocument> {
		const otp = new otpModel(data);
		return otp.save();
	}

	async updateOtp(otp: OTPDocument, data: Partial<OTPDocument>): Promise<OTPDocument> {
		Object.assign(otp, data);
		return otp.save();
	}

	async deleteOtp(otp: OTPDocument): Promise<void> {
		await otp.deleteOne();
	}
}

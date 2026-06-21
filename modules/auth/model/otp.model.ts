import mongoose, { Model, Schema, Document } from "mongoose";
export interface OTP {
	code: Number;
	expireTime: Date;
	otpId: String;
	approved: Boolean;
	/** تعداد تلاش‌های ناموفقِ واردکردن کد — برای جلوگیری از brute-force */
	attempts: Number;
}

export type OTPDocument = OTP & Document;
const otpSchema = new Schema(
	{
		code: Number,
		expireTime: {
			type: Date,
			required: true,
		},
		otpId: {
			type: String,
			required: true,
		},
		approved: {
			type: Boolean,
			required: true,
		},
		attempts: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ timestamps: true }
);

const otpModel: Model<OTPDocument> = mongoose.model<OTPDocument>("Otp", otpSchema);

export default otpModel;

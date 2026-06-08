import mongoose, { Model, Schema, Document } from "mongoose";
export interface OTP {
	code: Number;
	expireTime: Date;
	otpId: String;
	approved: Boolean;
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
	},
	{ timestamps: true }
);

const otpModel: Model<OTPDocument> = mongoose.model<OTPDocument>("Otp", otpSchema);

export default otpModel;

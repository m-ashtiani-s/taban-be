import mongoose, { Model, Schema, Document } from "mongoose";

export interface JusticeInquiry {
	justiceInquiryName: string;
	description: string;
	isActive: boolean;
}

export type JusticeInquiryDocument = JusticeInquiry & Document;

const justiceInquirySchema = new Schema(
	{
		justiceInquiryName: { type: String, required: true, unique: true },
		description: { type: String },
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const JusticeInquiryModel: Model<JusticeInquiryDocument> = mongoose.model<JusticeInquiryDocument>("JusticeInquiry", justiceInquirySchema);

export default JusticeInquiryModel;

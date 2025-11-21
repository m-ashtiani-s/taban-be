import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.mode";
import { LanguageDocument } from "../../language/model/translationItem.mode";
import { JusticeInquiry } from "../../justiceInquiry/model/justiceInquiry.mode";

export interface JusticeInquiryRate {
	translationItem: string | TranslationItemDocument;
	language: string | LanguageDocument;
	justiceInquiry: string | JusticeInquiry;
	isRequired: boolean;
	price: number;
}

export type JusticeInquiryRateDocument = JusticeInquiryRate & Document;

const justiceInquiryRateSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true },
		language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
		justiceInquiry: { type: Schema.Types.ObjectId, ref: "JusticeInquiry", required: true },
		isRequired: { type: Number, required: true, default: false },
		price: { type: Number, required: true },
	},
	{ timestamps: true }
);

const JusticeInquiryRateModel: Model<JusticeInquiryRateDocument> = mongoose.model<JusticeInquiryRateDocument>("JusticeInquiryRate", justiceInquiryRateSchema);

export default JusticeInquiryRateModel;

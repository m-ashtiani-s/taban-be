import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";
import { LanguageDocument } from "../../language/model/language.model";

export interface CertificationRate {
	translationItem: string | TranslationItemDocument;
	language: string | LanguageDocument;
	mfaPrice: number;
	justicePrice: number;
}

export type CertificationRateDocument = CertificationRate & Document;

const certificationRateSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true },
		language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
		mfaPrice: { type: Number, required: true }, // وزارت خارجه
		justicePrice: { type: Number, required: true }, // دادگستری
	},
	{ timestamps: true }
);

const CertificationRateModel: Model<CertificationRateDocument> = mongoose.model<CertificationRateDocument>("CertificationRate", certificationRateSchema);

export default CertificationRateModel;

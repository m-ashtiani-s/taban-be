import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.mode";
import { LanguageDocument } from "../../language/model/translationItem.mode";

export interface DynamicRate {
	translationItem: string | TranslationItemDocument;
	language: string | LanguageDocument;
	price: number;
	label: string;
}

export type DynamicRateDocument = DynamicRate & Document;

const dynamicRateSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true },
		language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
		price: { type: Number, required: true },
		label: { type: String, required: true },
	},
	{ timestamps: true }
);

const DynamicRateModel: Model<DynamicRateDocument> = mongoose.model<DynamicRateDocument>("DynamicRate", dynamicRateSchema);

export default DynamicRateModel;

import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";
import { LanguageDocument } from "../../language/model/language.model";

export interface DynamicRate {
	translationItem: string | TranslationItemDocument;
	language: string | LanguageDocument;
	price: number;
	label: string;
	description: string;
}

export type DynamicRateDocument = DynamicRate & Document;

const dynamicRateSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true },
		language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
		price: { type: Number, required: true },
		label: { type: String, required: true },
		description: { type: String, default: "", trim: true },
	},
	{ timestamps: true },
);

const DynamicRateModel: Model<DynamicRateDocument> = mongoose.model<DynamicRateDocument>("DynamicRate", dynamicRateSchema);

export default DynamicRateModel;

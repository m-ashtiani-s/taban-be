import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.mode";
import { LanguageDocument } from "../../language/model/translationItem.mode";

export interface BaseRate {
	translationItem: string | TranslationItemDocument;
	language: string | LanguageDocument;
	basePrice: number;
}

export type BaseRateDocument = BaseRate & Document;

const baseRateSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true },
		language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
		basePrice: { type: Number, required: true },
	},
	{ timestamps: true }
);

const BaseRateModel: Model<BaseRateDocument> = mongoose.model<BaseRateDocument>("BaseRate", baseRateSchema);

export default BaseRateModel;

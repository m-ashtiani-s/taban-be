import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.mode";
import { LanguageDocument } from "../../language/model/translationItem.mode";

export interface BaseRate {
	translationItem: string | TranslationItemDocument;
	language: string | LanguageDocument;
	basePrice: number;
	sanamPrice: number;
	daftariPrice: number;
	tasdighPrice: number;
	mohrPrice: number;
	title: string;
	description: string;
}

export type BaseRateDocument = BaseRate & Document;

const baseRateSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true },
		language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
		basePrice: { type: Number, required: true },
		title: { type: String, default: "", trim: true },
		sanamPrice: { type: Number, required: true },
		daftariPrice: { type: Number, required: true },
		tasdighPrice: { type: Number, required: true },
		mohrPrice: { type: Number, required: true },
		description: { type: String,default: "", trim: true },
	},
	{ timestamps: true },
);

const BaseRateModel: Model<BaseRateDocument> = mongoose.model<BaseRateDocument>("BaseRate", baseRateSchema);

export default BaseRateModel;

import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.mode";
import { LanguageDocument } from "../../language/model/translationItem.mode";
import { DynamicRateInputType } from "../dto/dynamicRateInputType.dto";
import { DynamicRateOption } from "../dto/dynamicRateOption.dto";

export interface DynamicRate {
	translationItem: string | TranslationItemDocument;
	language: string | LanguageDocument;
	price: number;
	label: string;
	inputType: DynamicRateInputType;
	options: DynamicRateOption[];
}

export type DynamicRateDocument = DynamicRate & Document;

const dynamicRateSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true },
		language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
		price: { type: Number, required: true },
		label: { type: String, required: true },
		inputType: { type: String, enum: ["NUMBER", "CHECKBOX", "SELECT"], required: true },
		options: [
			{
				label: String,
				price: Number,
			},
		]
	},
	{ timestamps: true }
);

const DynamicRateModel: Model<DynamicRateDocument> = mongoose.model<DynamicRateDocument>("DynamicRate", dynamicRateSchema);

export default DynamicRateModel;

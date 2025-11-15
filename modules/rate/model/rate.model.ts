import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translation/model/translationItem.mode";

export interface Rate {
	translationItemId: TranslationItemDocument["_id"];
	sourceLang: string;
	targetLang: string;
	price: number;
	duration: number;
}

export type RateDocument = Rate & Document;

const rateSchema = new Schema(
	{
		translationItemId: {
			type: Schema.Types.ObjectId,
			ref: "TranslationItem",
			required: true,
		},
		sourceLang: {
			type: String,
			required: true,
		},
		targetLang: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const RateModel: Model<RateDocument> = mongoose.model<RateDocument>("Rate", rateSchema);

export default RateModel;

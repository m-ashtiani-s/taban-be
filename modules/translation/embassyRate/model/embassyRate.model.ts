import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";
import { Embassy } from "../../embassy/model/embassy.model";

export interface EmbassyRate {
	translationItem: string | TranslationItemDocument;
	embassy: string | Embassy;
	isRequired: boolean;
	price: number;
}

export type EmbassyRateDocument = EmbassyRate & Document;

const embassyRateSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true },
		embassy: { type: Schema.Types.ObjectId, ref: "Embassy", required: true },
		isRequired: { type: Number, required: true, default: false },
		price: { type: Number, required: true },
	},
	{ timestamps: true }
);

const EmbassyRateModel: Model<EmbassyRateDocument> = mongoose.model<EmbassyRateDocument>("EmbassyRate", embassyRateSchema);

export default EmbassyRateModel;

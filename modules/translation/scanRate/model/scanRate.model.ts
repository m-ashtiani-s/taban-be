import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";

export interface ScanRate {
	translationItem: string | TranslationItemDocument;
	price: number;
}

export type ScanRateDocument = ScanRate & Document;

const scanRateSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true },
		price: { type: Number, required: true },
	},
	{ timestamps: true }
);

const ScanRateModel: Model<ScanRateDocument> = mongoose.model<ScanRateDocument>("ScanRate", scanRateSchema);

export default ScanRateModel;

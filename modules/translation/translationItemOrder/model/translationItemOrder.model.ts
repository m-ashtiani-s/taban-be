import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";

export interface TranslationItemOrder {
	translationItem: string | TranslationItemDocument;
	order: number;
}

export type TranslationItemOrderDocument = TranslationItemOrder & Document;

const translationItemOrderSchema = new Schema(
	{
		translationItem: { type: Schema.Types.ObjectId, ref: "TranslationItem", required: true, unique: true },
		order: { type: Number, required: true },
	},
	{ timestamps: true },
);

const TranslationItemOrderModel: Model<TranslationItemOrderDocument> = mongoose.model<TranslationItemOrderDocument>(
	"TranslationItemOrder",
	translationItemOrderSchema,
);

export default TranslationItemOrderModel;

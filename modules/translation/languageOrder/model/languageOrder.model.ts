import mongoose, { Model, Schema, Document } from "mongoose";
import { LanguageDocument } from "../../language/model/language.model";

export interface LanguageOrder {
	language: string | LanguageDocument;
	order: number;
}

export type LanguageOrderDocument = LanguageOrder & Document;

const languageOrderSchema = new Schema(
	{
		language: { type: Schema.Types.ObjectId, ref: "Language", required: true, unique: true },
		order: { type: Number, required: true },
	},
	{ timestamps: true },
);

const LanguageOrderModel: Model<LanguageOrderDocument> = mongoose.model<LanguageOrderDocument>(
	"LanguageOrder",
	languageOrderSchema,
);

export default LanguageOrderModel;

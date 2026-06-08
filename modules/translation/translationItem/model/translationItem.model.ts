import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemCategoryDocument } from "../../translationItemCategory/model/translationItemCategory.model";

export interface TranslationItem {
	title: string;
	documentType: string;
	isActive: boolean;
	description: string;
	category: string | TranslationItemCategoryDocument;
}

export type TranslationItemDocument = TranslationItem & Document;

const translationItemSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		documentType: {
			type: String,
			required: true,
			unique: true,
		},
		category: { type: Schema.Types.ObjectId, ref: "TranslationItemCategory" , default:null },
		isActive: {
			type: Boolean,
			default: true,
		},
		description: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const TranslationItemModel: Model<TranslationItemDocument> = mongoose.model<TranslationItemDocument>("TranslationItem", translationItemSchema);

export default TranslationItemModel;

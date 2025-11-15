import mongoose, { Model, Schema, Document } from "mongoose";

export interface TranslationItem {
	title: string;
	documentType: string;
	isActive: boolean; 
}

export type TranslationItemDocument = TranslationItem & Document;

const translationItemSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		documentType: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const TranslationItemModel: Model<TranslationItemDocument> = mongoose.model<TranslationItemDocument>("TranslationItem", translationItemSchema);

export default TranslationItemModel;

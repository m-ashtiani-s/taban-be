import mongoose, { Model, Schema, Document } from "mongoose";

export interface TranslationItem {
	title: string;
	documentType: string;
	isActive: boolean;
	description: string;
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

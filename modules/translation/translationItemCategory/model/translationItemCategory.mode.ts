import mongoose, { Model, Schema, Document } from "mongoose";

export interface TranslationItemCategory {
	title: string;
}

export type TranslationItemCategoryDocument = TranslationItemCategory & Document;

const translationItemCategorySchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		}
	},
	{ timestamps: true }
);

const TranslationItemCategoryModel: Model<TranslationItemCategoryDocument> = mongoose.model<TranslationItemCategoryDocument>("TranslationItemCategory", translationItemCategorySchema);

export default TranslationItemCategoryModel;

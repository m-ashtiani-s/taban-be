import mongoose, { Model, Schema, Document } from "mongoose";

export interface Language {
	languageName: string;
	languageCode: string;
	icon: string;
}

export type LanguageDocument = Language & Document;

const languageSchema = new Schema(
	{
		languageName: { type: String, required: true, unique: true },
		languageCode: { type: String, required: true, unique: true },
		icon: { type: String}
	},
	{ timestamps: true }
);

const LanguageModel: Model<LanguageDocument> = mongoose.model<LanguageDocument>("Language", languageSchema);

export default LanguageModel;

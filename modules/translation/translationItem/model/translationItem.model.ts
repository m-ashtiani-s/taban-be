import mongoose, { Model, Schema, Document } from "mongoose";
import { TranslationItemCategoryDocument } from "../../translationItemCategory/model/translationItemCategory.model";

export interface TranslationItem {
	title: string;
	documentType: string;
	isActive: boolean;
	description: string;
	/** توضیحات راهنمای آپلود مدارک که ادمین می‌نویسد و در مرحله‌ی آپلود به کاربر نمایش داده می‌شود */
	uploadDescription: string;
	/** پلیس‌هولدرِ نام مدرک که ادمین می‌نویسد و در ورودیِ نام‌گذاریِ مدرک به کاربر نمایش داده می‌شود */
	namePlaceholder: string;
	category: string | TranslationItemCategoryDocument;
	/** ضریب امتیاز این مدرک در باشگاه مشتریان (به ازای هر نسخه). پیش‌فرض ۱ */
	scoreMultiplier: number;
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
		uploadDescription: {
			type: String,
			default: "",
		},
		namePlaceholder: {
			type: String,
			default: "",
		},
		scoreMultiplier: {
			type: Number,
			default: 1,
			min: 0,
		},
	},
	{ timestamps: true }
);

const TranslationItemModel: Model<TranslationItemDocument> = mongoose.model<TranslationItemDocument>("TranslationItem", translationItemSchema);

export default TranslationItemModel;

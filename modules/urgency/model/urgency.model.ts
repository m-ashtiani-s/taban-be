import mongoose, { Document, Model, Schema } from "mongoose";

// تنظیمات فوریت — بازه‌ی روزهای کاری برای انجام ترجمه و تاییدات. به‌صورت تک‌سند (singleton) نگه‌داری می‌شود.
export interface UrgencySetting {
	translationMinDays: number;
	translationMaxDays: number;
	justiceMinDays: number;
	justiceMaxDays: number;
	mfaMinDays: number;
	mfaMaxDays: number;
}

export interface UrgencySettingDocument extends UrgencySetting, Document {
	createdAt: Date;
	updatedAt: Date;
}

const urgencySettingSchema = new Schema(
	{
		translationMinDays: { type: Number, required: true, min: 0, default: 3 },
		translationMaxDays: { type: Number, required: true, min: 0, default: 5 },
		justiceMinDays: { type: Number, required: true, min: 0, default: 2 },
		justiceMaxDays: { type: Number, required: true, min: 0, default: 4 },
		mfaMinDays: { type: Number, required: true, min: 0, default: 2 },
		mfaMaxDays: { type: Number, required: true, min: 0, default: 4 },
	},
	{ timestamps: true }
);

const UrgencySettingModel: Model<UrgencySettingDocument> = mongoose.model<UrgencySettingDocument>(
	"UrgencySetting",
	urgencySettingSchema
);

export default UrgencySettingModel;

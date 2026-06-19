import mongoose, { Document, Model, Schema } from "mongoose";

// پیکربندی باشگاه مشتریان — آستانه‌ی امتیاز و درصد تخفیف هر سطح. به‌صورت تک‌سند (singleton).
export interface ClubConfig {
	bronzeMinScore: number;
	silverMinScore: number;
	goldMinScore: number;
	bronzeDiscount: number;
	silverDiscount: number;
	goldDiscount: number;
}

export interface ClubConfigDocument extends ClubConfig, Document {
	createdAt: Date;
	updatedAt: Date;
}

const clubConfigSchema = new Schema(
	{
		bronzeMinScore: { type: Number, required: true, min: 0, default: 20 },
		silverMinScore: { type: Number, required: true, min: 0, default: 40 },
		goldMinScore: { type: Number, required: true, min: 0, default: 60 },
		bronzeDiscount: { type: Number, required: true, min: 0, max: 100, default: 10 },
		silverDiscount: { type: Number, required: true, min: 0, max: 100, default: 15 },
		goldDiscount: { type: Number, required: true, min: 0, max: 100, default: 20 },
	},
	{ timestamps: true }
);

const ClubConfigModel: Model<ClubConfigDocument> = mongoose.model<ClubConfigDocument>("ClubConfig", clubConfigSchema);

export default ClubConfigModel;

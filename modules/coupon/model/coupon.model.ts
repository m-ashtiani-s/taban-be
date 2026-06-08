import mongoose, { Document, Model, ObjectId, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export enum DiscountType {
	PERCENT = "percent",
	FIXED = "fixed",
}
export enum AppliesTo {
	BASE = "base",
	TOTAL = "total",
}

export interface Coupon {
	code: string;
	discountType: DiscountType;
	discountValue: number;
	maxDiscountAmount: number | null;
	minPurchaseAmount: number | null;
	startDate: Date | null;
	endDate: Date | null;
	usageLimit: number | null;
	usedCount: number;
	perUserLimit: number | null;
	isActive: boolean;
	description: string;
	appliesTo: AppliesTo;
	applicableTranslationItems: ObjectId[] | string[];
}

export interface CouponDocument extends Coupon, Document {
	createdAt: Date;
	updatedAt: Date;
}

const couponSchema = new Schema(
	{
		code: { type: String, required: true, unique: true, uppercase: true, trim: true },
		discountType: { type: String, enum: Object.values(DiscountType), required: true },
		discountValue: { type: Number, required: true, min: 0 },
		maxDiscountAmount: { type: Number, min: 0, default: null },
		minPurchaseAmount: { type: Number, min: 0, default: null },
		startDate: { type: Date, default: null },
		endDate: { type: Date, default: null },
		usageLimit: { type: Number, min: 0, default: null },
		usedCount: { type: Number, default: 0, min: 0 },
		perUserLimit: { type: Number, min: 0, default: null },
		isActive: { type: Boolean, default: true },
		description: { type: String, default: "" },
		appliesTo: { type: String, enum: Object.values(AppliesTo), default: AppliesTo.TOTAL, required: true },
		applicableTranslationItems: [{ type: Schema.Types.ObjectId, ref: "TranslationItem" }],
	},
	{ timestamps: true }
);

couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.plugin(mongoosePaginate);

const CouponModel = mongoose.model<CouponDocument, PaginateModel<CouponDocument>>("Coupon", couponSchema);

export default CouponModel;

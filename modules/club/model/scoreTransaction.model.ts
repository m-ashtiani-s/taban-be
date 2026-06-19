import mongoose, { Document, ObjectId, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// هر بار که برای کاربری امتیاز ثبت می‌شود (مثلاً پرداخت یک سفارش) یک تراکنش اینجا ذخیره می‌شود.
export interface ScoreTransaction {
	user: ObjectId | string;
	order: ObjectId | string | null;
	orderNumber: number | null;
	points: number;
	description: string;
}

export interface ScoreTransactionDocument extends ScoreTransaction, Document {
	createdAt: Date;
	updatedAt: Date;
}

const scoreTransactionSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		order: { type: Schema.Types.ObjectId, ref: "Order", default: null },
		orderNumber: { type: Number, default: null },
		points: { type: Number, required: true },
		description: { type: String, default: "" },
	},
	{ timestamps: true }
);

scoreTransactionSchema.index({ user: 1, createdAt: -1 });
scoreTransactionSchema.index({ order: 1 });
scoreTransactionSchema.plugin(mongoosePaginate);

const ScoreTransactionModel = mongoose.model<ScoreTransactionDocument, PaginateModel<ScoreTransactionDocument>>(
	"ScoreTransaction",
	scoreTransactionSchema
);

export default ScoreTransactionModel;

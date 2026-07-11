import mongoose, { Document, ObjectId, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export enum PaymentStatus {
	PENDING = "pending",
	PAID = "paid",
	FAILED = "failed",
	CANCELED = "canceled",
}

export enum PaymentGateway {
	ZARINPAL = "zarinpal",
}

// ماژول پرداخت مستقل است و مستقیماً به یک سفارش (order) وصل می‌شود؛ پس از پرداخت موفق،
// سفارش پرداخت‌شده و صورتحساب آن به‌صورت خودکار صادر می‌گردد.
export interface Payment {
	gateway: PaymentGateway;
	order: ObjectId | string;
	user: ObjectId | string;
	// مبلغی که به درگاه ارسال شده — بر اساس واحد currency (ریال یا تومان). همین مبلغ در verify نیز استفاده می‌شود.
	amount: number;
	currency: "IRR" | "IRT";
	authority: string | null;
	refId: string | null;
	cardPan: string | null;
	status: PaymentStatus;
	description: string;
	paidAt: Date | null;
	// آدرس صفحه‌ی نتیجه در فرانت که پس از پایان پرداخت، کاربر به آن هدایت می‌شود.
	// توسط فرانت هنگام شروع پرداخت ارسال می‌شود؛ اگر خالی باشد از config استفاده می‌شود.
	backUrl: string | null;
	// پاسخ خام درگاه برای رهگیری/دیباگ
	meta: Record<string, unknown> | null;
}

export interface PaymentDocument extends Payment, Document {
	createdAt: Date;
	updatedAt: Date;
}

const paymentSchema = new Schema(
	{
		gateway: { type: String, enum: Object.values(PaymentGateway), default: PaymentGateway.ZARINPAL, required: true },
		order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		amount: { type: Number, required: true, min: 0 },
		currency: { type: String, enum: ["IRR", "IRT"], required: true },
		authority: { type: String, default: null },
		refId: { type: String, default: null },
		cardPan: { type: String, default: null },
		status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING, required: true },
		description: { type: String, default: "" },
		paidAt: { type: Date, default: null },
		backUrl: { type: String, default: null },
		meta: { type: Schema.Types.Mixed, default: null },
	},
	{ timestamps: true }
);

// authority فقط زمانی یکتا بررسی می‌شود که واقعاً یک رشته باشد. از partialFilterExpression
// به‌جای sparse استفاده می‌کنیم چون رکوردهای زیادی با authority=null وجود دارند (پیش از دریافت
// authority از درگاه) و sparse فقط فیلدهای «غایب» را نادیده می‌گیرد نه فیلدهای null.
paymentSchema.index({ authority: 1 }, { unique: true, partialFilterExpression: { authority: { $type: "string" } } });
paymentSchema.index({ order: 1, status: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });

paymentSchema.plugin(mongoosePaginate);

const PaymentModel = mongoose.model<PaymentDocument, PaginateModel<PaymentDocument>>("Payment", paymentSchema);

export default PaymentModel;

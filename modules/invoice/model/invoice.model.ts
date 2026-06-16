import mongoose, { Document, ObjectId, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export enum InvoiceStatus {
	CREATED = "created",
	ISSUED = "issued",
	PAID = "paid",
	CANCELED = "canceled",
}

// انواع موجودیتی که یک صورتحساب می‌تواند به آن ارجاع دهد. فعلاً تنها ORDER است.
export enum InvoiceReferenceType {
	ORDER = "order",
}

export enum InvoiceIssuerType {
	SYSTEM = "system",
	ADMIN = "admin",
}

export interface InvoiceItem {
	title: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

export interface Invoice {
	invoiceNumber: number;
	referenceType: InvoiceReferenceType | null;
	referenceId: ObjectId | string | null;
	referenceNumber: number | null;
	user: ObjectId | string;
	subject: string;
	description: string | null;
	items: InvoiceItem[];
	subtotal: number;
	vatRate: number;
	vatAmount: number;
	totalAmount: number;
	status: InvoiceStatus;
	issuerType: InvoiceIssuerType;
	issuedBy: ObjectId | string | null;
	paymentDetail: Record<string, unknown> | null;
	paidAt: Date | null;
	// حذف نرم — صورتحساب‌های isActive=false در هیچ لیست/جزئیاتی نمایش داده نمی‌شوند
	isActive: boolean;
}

export interface InvoiceDocument extends Invoice, Document {
	createdAt: Date;
	updatedAt: Date;
}

const invoiceItemSchema = new Schema<InvoiceItem>(
	{
		title: { type: String, required: true, trim: true },
		quantity: { type: Number, required: true, min: 1 },
		unitPrice: { type: Number, required: true, min: 0 },
		total: { type: Number, required: true, min: 0 },
	},
	{ _id: false }
);

const invoiceSchema = new Schema(
	{
		invoiceNumber: { type: Number, required: true, unique: true },
		// مرجع عمومی — می‌تواند به هر موجودیتی اشاره کند یا کاملاً نال باشد
		referenceType: { type: String, enum: Object.values(InvoiceReferenceType), default: null },
		referenceId: { type: Schema.Types.ObjectId, default: null },
		referenceNumber: { type: Number, default: null },
		// مالک/پرداخت‌کننده‌ی صورتحساب — همیشه الزامی
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		subject: { type: String, required: true, trim: true },
		description: { type: String, default: null },
		items: { type: [invoiceItemSchema], default: [] },
		subtotal: { type: Number, required: true, min: 0 },
		// نرخ مالیات به‌صورت اسنپ‌شات از config در لحظه‌ی ساخت ذخیره می‌شود تا صورتحساب‌های
		// قدیمی با تغییر نرخ در آینده دست‌نخورده بمانند.
		vatRate: { type: Number, required: true, min: 0, default: 0 },
		vatAmount: { type: Number, required: true, min: 0, default: 0 },
		totalAmount: { type: Number, required: true, min: 0 },
		status: {
			type: String,
			enum: Object.values(InvoiceStatus),
			default: InvoiceStatus.CREATED,
			required: true,
		},
		issuerType: { type: String, enum: Object.values(InvoiceIssuerType), required: true },
		issuedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
		// تا راه‌اندازی سیستم پرداخت نال می‌ماند
		paymentDetail: { type: Schema.Types.Mixed, default: null },
		paidAt: { type: Date, default: null },
		// حذف نرم
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

invoiceSchema.index({ user: 1, status: 1, createdAt: -1 });
invoiceSchema.index({ referenceType: 1, referenceId: 1 });
invoiceSchema.index({ status: 1, createdAt: -1 });
invoiceSchema.plugin(mongoosePaginate);

const InvoiceModel = mongoose.model<InvoiceDocument, PaginateModel<InvoiceDocument>>("Invoice", invoiceSchema);

export default InvoiceModel;

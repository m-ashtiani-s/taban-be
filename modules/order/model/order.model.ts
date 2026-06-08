import mongoose, { Document, ObjectId, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { AddDocumentToCartDto } from "../../cart/dto/cartItem.dto";
import { RateCalculationResponseDto } from "../../rateCalculator/dto/rateCalculation.dto";

export enum OrderStatus {
	PENDING = "pending",
	APPROVED = "approved",
	PAID = "paid",
	PROCESSING = "processing",
	SHIPPED = "shipped",
	DELIVERED = "delivered",
	CANCELED = "canceled",
	REJECTED = "rejected",
}
export enum PaymentStatus {
	PENDING = "pending",
	PAID = "paid",
	FAILED = "failed",
}

export interface OrderedDoc {
	cartItemId: string;
	translationItemId: string;
	translationItemTitle: string;
	languageId: string;
	languageName: string;
	payload: AddDocumentToCartDto;
	breakdown: RateCalculationResponseDto;
	itemTotal: number;
}

export interface Order {
	orderNumber: number;
	user: ObjectId | string;
	customer: ObjectId | string | null;
	orderedDocs: OrderedDoc[];
	coupon: ObjectId | string | null;
	discountAmount: number;
	totalAmount: number;
	shippingAddress: ObjectId | string;
	status: OrderStatus;
	rejectedRemarks: string | null;
	paymentStatus: PaymentStatus;
	finalAmount: number;
	remarks: string;
}

export interface OrderDocument extends Order, Document {
	createdAt: Date;
	updatedAt: Date;
}

const orderSchema = new Schema(
	{
		orderNumber: { type: Number, required: true, unique: true },
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		customer: { type: Schema.Types.ObjectId, ref: "Customer", default: null },
		orderedDocs: { type: [Schema.Types.Mixed], default: [] },
		coupon: { type: Schema.Types.ObjectId, ref: "Coupon", default: null },
		discountAmount: { type: Number, default: 0, min: 0 },
		totalAmount: { type: Number, required: true, min: 0 },
		shippingAddress: { type: Schema.Types.ObjectId, ref: "ShippingAddress", required: true },
		status: {
			type: String,
			enum: Object.values(OrderStatus),
			default: OrderStatus.PENDING,
			required: true,
		},
		rejectedRemarks: { type: String, default: null },
		paymentStatus: {
			type: String,
			enum: Object.values(PaymentStatus),
			default: PaymentStatus.PENDING,
		},
		finalAmount: { type: Number, required: true, min: 0 },
		remarks: { type: String, default: "" },
	},
	{ timestamps: true }
);

orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ status: 1, paymentStatus: 1, createdAt: -1 });
orderSchema.plugin(mongoosePaginate);

const OrderModel = mongoose.model<OrderDocument, PaginateModel<OrderDocument>>("Order", orderSchema);

export default OrderModel;

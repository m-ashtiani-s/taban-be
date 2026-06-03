import mongoose, { Document, Model, Schema } from "mongoose";

export interface OrderCounterDocument extends Document {
	_id: string;
	seq: number;
}

const orderCounterSchema = new Schema({
	_id: { type: String, required: true },
	seq: { type: Number, default: 100000 },
});

const OrderCounterModel: Model<OrderCounterDocument> = mongoose.model<OrderCounterDocument>(
	"OrderCounter",
	orderCounterSchema
);

export default OrderCounterModel;

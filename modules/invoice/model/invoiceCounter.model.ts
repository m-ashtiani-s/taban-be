import mongoose, { Document, Model, Schema } from "mongoose";

export interface InvoiceCounterDocument extends Document {
	_id: string;
	seq: number;
}

const invoiceCounterSchema = new Schema({
	_id: { type: String, required: true },
	seq: { type: Number, default: 100000 },
});

const InvoiceCounterModel: Model<InvoiceCounterDocument> = mongoose.model<InvoiceCounterDocument>(
	"InvoiceCounter",
	invoiceCounterSchema
);

export default InvoiceCounterModel;

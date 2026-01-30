import mongoose, { Document, Model, ObjectId, PaginateModel, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";
import { OrderedDocumentDto } from "../dto/orderedDocumentDto.dto";

export interface Cart {
	userId: ObjectId;
	documents: OrderedDocumentDto[];
	cartSum: number;
	cartSumWithDiscount: number;
}

export interface CartDocument extends Cart, Document {}

const cartSchema = new mongoose.Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user" },
		products: [],
		cartSum: { type: Number, required: true },
		cartSumWithDiscount: { type: Number, required: true },
	},
	{ timestamps: true }
);

const CartModel: Model<CartDocument> = mongoose.model<CartDocument>("Cart", cartSchema);

export default CartModel;

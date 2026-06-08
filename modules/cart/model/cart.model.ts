import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";
import { CartItemDto } from "../dto/cartItem.dto";
import { AppliedCouponDto } from "../dto/cart.dto";

export interface Cart {
	user: ObjectId;
	items: CartItemDto[];
	cartSum: number;
	cartSumWithDiscount: number;
	appliedCoupon: AppliedCouponDto | null;
}

export interface CartDocument extends Cart, Document {}

const cartSchema = new mongoose.Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
		items: { type: [Schema.Types.Mixed], default: [] },
		cartSum: { type: Number, required: true, default: 0 },
		cartSumWithDiscount: { type: Number, required: true, default: 0 },
		appliedCoupon: { type: Schema.Types.Mixed, default: null },
	},
	{ timestamps: true }
);

const CartModel: Model<CartDocument> = mongoose.model<CartDocument>("Cart", cartSchema);

export default CartModel;

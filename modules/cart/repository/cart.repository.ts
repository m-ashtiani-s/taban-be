import mongoose from "mongoose";
import CartModel, { CartDocument } from "../model/cart.model";

export default class CartRepository {
	async findByCartId(id: string): Promise<CartDocument | null> {
		return await CartModel.findById(id);
	}

	async findByUserId(userId: string, session?: mongoose.ClientSession): Promise<CartDocument | null> {
		let query = CartModel.findOne({ user: userId });
		if (session) {
			query = query.session(session);
		}
		return await query;
	}

	async findOrCreateByUserId(userId: string): Promise<CartDocument> {
		const existing = await CartModel.findOne({ user: userId });
		if (existing) return existing;
		const cart = new CartModel({ user: userId, items: [], cartSum: 0, cartSumWithDiscount: 0, appliedCoupon: null });
		return cart.save();
	}

	async updateCart(updatedCart: CartDocument, session?: mongoose.ClientSession): Promise<void> {
		updatedCart.markModified("items");
		updatedCart.markModified("appliedCoupon");
		await updatedCart.save({ session });
	}
}

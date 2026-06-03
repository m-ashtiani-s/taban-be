import CartModel, { CartDocument } from "../model/cart.model";

export default class CartRepository {
	async findByCartId(id: string): Promise<CartDocument | null> {
		return await CartModel.findById(id);
	}

	async findByUserId(userId: string): Promise<CartDocument | null> {
		return await CartModel.findOne({ user: userId });
	}

	async findOrCreateByUserId(userId: string): Promise<CartDocument> {
		const existing = await CartModel.findOne({ user: userId });
		if (existing) return existing;
		const cart = new CartModel({ user: userId, items: [], cartSum: 0, cartSumWithDiscount: 0, appliedCoupon: null });
		return cart.save();
	}

	async updateCart(updatedCart: CartDocument): Promise<void> {
		updatedCart.markModified("items");
		updatedCart.markModified("appliedCoupon");
		await updatedCart.save();
	}
}

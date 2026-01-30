import userModel, { CartDocument } from "../model/cart.model";

export default class CartRepository {
	async findByCartId(id: string): Promise<CartDocument | null> {
		return await userModel.findById(id);
	}

	async findByUserId(userId: string): Promise<CartDocument | null> {
		return await userModel.findOne({ user: userId });
	}

	async updateCart(updatedCart: CartDocument): Promise<void> {
		await updatedCart.save();
	}
}

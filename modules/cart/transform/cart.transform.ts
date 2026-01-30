import { cartDto } from "../dto/cart.dto";
import { CartDocument } from "../model/cart.model";

export default class CartTransform {
	cart(cart: CartDocument): cartDto {
		return {
			cartId: cart?._id as string,
			documents: cart?.documents ?? [],
			cartSum: cart?.cartSum ?? 0,
			cartSumWithDiscount: cart?.cartSumWithDiscount ?? 0,
		};
	}
}

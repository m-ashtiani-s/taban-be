import { CartDto } from "../dto/cart.dto";
import { CartItemDto } from "../dto/cartItem.dto";
import { CartDocument } from "../model/cart.model";

export default class CartTransform {
	cart(cart: CartDocument): CartDto {
		return {
			cartId: cart?._id as string,
			items: (cart?.items ?? []).map((item) => this.enrichItem(item)),
			cartSum: cart?.cartSum ?? 0,
			cartSumWithDiscount: cart?.cartSumWithDiscount ?? 0,
			appliedCoupon: cart?.appliedCoupon ?? null,
		};
	}

	/**
	 * هر مدرک را با فیلد `translationTotal` (مجموع نرخ پایه + ویژگی‌های داینامیک)
	 * غنی می‌کند تا فرانت بتواند آن را به‌عنوان یک قلم واحد «هزینه ترجمه» نمایش دهد.
	 * تاییدات، استعلام‌ها و سایر اقلام بدون تغییر باقی می‌مانند.
	 */
	private enrichItem(item: CartItemDto): CartItemDto {
		const documents = (item?.breakdown?.documents ?? []).map((doc) => ({
			...doc,
			translationTotal: (doc?.base?.total ?? 0) + (doc?.specialsTotal ?? 0),
		}));

		return {
			...item,
			breakdown: {
				...item.breakdown,
				documents,
			},
		};
	}
}

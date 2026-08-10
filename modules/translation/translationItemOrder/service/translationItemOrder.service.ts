import { TranslationItemOrderDto } from "../dto/translationItemOrder.dto";
import TranslationItemOrderRepository from "../repository/translationItemOrder.repository";

export default class TranslationItemOrderService {
	private translationItemOrderRepository = new TranslationItemOrderRepository();

	/** نگاشتِ translationItemId → order برای مرتب‌سازیِ مدارک در لایه‌ی ترنسفورم */
	async getOrderMap(): Promise<Record<string, number>> {
		const orders = await this.translationItemOrderRepository.findAll();
		const map: Record<string, number> = {};
		orders?.forEach((it) => {
			map[String(it.translationItem)] = it.order;
		});
		return map;
	}

	async setTranslationItemsOrder(orders: TranslationItemOrderDto[]) {
		await this.translationItemOrderRepository.bulkUpsert(orders);
		return {
			field: "setTranslationItemsOrder",
			success: true,
			data: null,
			message: "ترتیب نمایش مدارک با موفقیت ذخیره شد",
		};
	}

	async removeTranslationItemOrder(translationItemId: string): Promise<void> {
		await this.translationItemOrderRepository.deleteByTranslationItem(translationItemId);
	}
}

import { LanguageOrderDto } from "../dto/languageOrder.dto";
import LanguageOrderRepository from "../repository/languageOrder.repository";

export default class LanguageOrderService {
	private languageOrderRepository = new LanguageOrderRepository();

	/** نگاشتِ languageId → order برای مرتب‌سازیِ زبان‌ها در لایه‌ی ترنسفورم */
	async getOrderMap(): Promise<Record<string, number>> {
		const orders = await this.languageOrderRepository.findAll();
		const map: Record<string, number> = {};
		orders?.forEach((it) => {
			map[String(it.language)] = it.order;
		});
		return map;
	}

	async setLanguagesOrder(orders: LanguageOrderDto[]) {
		await this.languageOrderRepository.bulkUpsert(orders);
		return {
			field: "setLanguagesOrder",
			success: true,
			data: null,
			message: "ترتیب نمایش زبان‌ها با موفقیت ذخیره شد",
		};
	}
}

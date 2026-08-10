import { EmbassyOrderDto } from "../dto/embassyOrder.dto";
import EmbassyOrderRepository from "../repository/embassyOrder.repository";

export default class EmbassyOrderService {
	private embassyOrderRepository = new EmbassyOrderRepository();

	/** نگاشتِ embassyId → order برای مرتب‌سازیِ سفارت‌ها در لایه‌ی ترنسفورم */
	async getOrderMap(): Promise<Record<string, number>> {
		const orders = await this.embassyOrderRepository.findAll();
		const map: Record<string, number> = {};
		orders?.forEach((it) => {
			map[String(it.embassy)] = it.order;
		});
		return map;
	}

	async setEmbassiesOrder(orders: EmbassyOrderDto[]) {
		await this.embassyOrderRepository.bulkUpsert(orders);
		return {
			field: "setEmbassiesOrder",
			success: true,
			data: null,
			message: "ترتیب نمایش سفارت‌ها با موفقیت ذخیره شد",
		};
	}

	async removeEmbassyOrder(embassyId: string): Promise<void> {
		await this.embassyOrderRepository.deleteByEmbassy(embassyId);
	}
}

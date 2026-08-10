import { Types } from "mongoose";
import LanguageOrderModel, { LanguageOrderDocument } from "../model/languageOrder.model";
import { LanguageOrderDto } from "../dto/languageOrder.dto";

export default class LanguageOrderRepository {
	async findAll(): Promise<LanguageOrderDocument[]> {
		return LanguageOrderModel.find();
	}

	async bulkUpsert(orders: LanguageOrderDto[]): Promise<void> {
		if (!orders?.length) return;
		await LanguageOrderModel.bulkWrite(
			orders.map((it) => ({
				updateOne: {
					filter: { language: new Types.ObjectId(it.languageId) },
					update: { $set: { order: it.order } },
					upsert: true,
				},
			})),
		);
	}

	async deleteByLanguage(languageId: string): Promise<void> {
		await LanguageOrderModel.deleteOne({ language: new Types.ObjectId(languageId) });
	}
}

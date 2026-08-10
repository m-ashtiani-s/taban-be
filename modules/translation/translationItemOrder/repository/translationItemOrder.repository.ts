import { Types } from "mongoose";
import TranslationItemOrderModel, { TranslationItemOrderDocument } from "../model/translationItemOrder.model";
import { TranslationItemOrderDto } from "../dto/translationItemOrder.dto";

export default class TranslationItemOrderRepository {
	async findAll(): Promise<TranslationItemOrderDocument[]> {
		return TranslationItemOrderModel.find();
	}

	async bulkUpsert(orders: TranslationItemOrderDto[]): Promise<void> {
		if (!orders?.length) return;
		await TranslationItemOrderModel.bulkWrite(
			orders.map((it) => ({
				updateOne: {
					filter: { translationItem: new Types.ObjectId(it.translationItemId) },
					update: { $set: { order: it.order } },
					upsert: true,
				},
			})),
		);
	}

	async deleteByTranslationItem(translationItemId: string): Promise<void> {
		await TranslationItemOrderModel.deleteOne({ translationItem: new Types.ObjectId(translationItemId) });
	}
}

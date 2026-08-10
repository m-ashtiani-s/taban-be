import { Types } from "mongoose";
import EmbassyOrderModel, { EmbassyOrderDocument } from "../model/embassyOrder.model";
import { EmbassyOrderDto } from "../dto/embassyOrder.dto";

export default class EmbassyOrderRepository {
	async findAll(): Promise<EmbassyOrderDocument[]> {
		return EmbassyOrderModel.find();
	}

	async bulkUpsert(orders: EmbassyOrderDto[]): Promise<void> {
		if (!orders?.length) return;
		await EmbassyOrderModel.bulkWrite(
			orders.map((it) => ({
				updateOne: {
					filter: { embassy: new Types.ObjectId(it.embassyId) },
					update: { $set: { order: it.order } },
					upsert: true,
				},
			})),
		);
	}

	async deleteByEmbassy(embassyId: string): Promise<void> {
		await EmbassyOrderModel.deleteOne({ embassy: new Types.ObjectId(embassyId) });
	}
}

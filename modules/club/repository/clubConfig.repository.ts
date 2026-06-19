import ClubConfigModel, { ClubConfigDocument } from "../model/clubConfig.model";
import { UpdateClubConfigDto } from "../dto/club.dto";

export default class ClubConfigRepository {
	/** پیکربندی باشگاه را برمی‌گرداند؛ اگر نباشد با مقادیر پیش‌فرض می‌سازد. */
	async getConfig(): Promise<ClubConfigDocument> {
		const existing = await ClubConfigModel.findOne().exec();
		if (existing) return existing;
		return ClubConfigModel.create({});
	}

	async updateConfig(data: UpdateClubConfigDto): Promise<ClubConfigDocument> {
		const updated = await ClubConfigModel.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
		).exec();
		return updated!;
	}
}

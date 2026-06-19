import UrgencySettingModel, { UrgencySettingDocument } from "../model/urgency.model";
import { UpdateUrgencyDto } from "../dto/urgency.dto";

export default class UrgencyRepository {
	/** تنظیمات فوریت را برمی‌گرداند؛ اگر هنوز ساخته نشده باشد، با مقادیر پیش‌فرض ایجاد می‌کند. */
	async getSettings(): Promise<UrgencySettingDocument> {
		const existing = await UrgencySettingModel.findOne().exec();
		if (existing) return existing;
		return UrgencySettingModel.create({});
	}

	async updateSettings(data: UpdateUrgencyDto): Promise<UrgencySettingDocument> {
		const updated = await UrgencySettingModel.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
		).exec();
		return updated!;
	}
}

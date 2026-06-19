import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { UpdateUrgencyDto } from "../dto/urgency.dto";
import UrgencyRepository from "../repository/urgency.repository";
import UrgencyTransform from "../transform/urgency.transform";

export default class AdminUrgencyService {
	private urgencyRepository = new UrgencyRepository();
	private urgencyTransform = new UrgencyTransform();

	async getUrgency() {
		const settings = await this.urgencyRepository.getSettings();
		return {
			field: "getUrgency",
			success: true,
			message: "تنظیمات فوریت با موفقیت دریافت شد",
			data: this.urgencyTransform.urgency(settings),
		};
	}

	async updateUrgency(data: UpdateUrgencyDto) {
		this.validate(data);
		const settings = await this.urgencyRepository.updateSettings(data);
		return {
			field: "updateUrgency",
			success: true,
			message: "تنظیمات فوریت با موفقیت به‌روزرسانی شد",
			data: this.urgencyTransform.urgency(settings),
		};
	}

	private validate(data: UpdateUrgencyDto) {
		const pairs: [number, number, string][] = [
			[data.translationMinDays, data.translationMaxDays, "ترجمه"],
			[data.justiceMinDays, data.justiceMaxDays, "تایید دادگستری"],
			[data.mfaMinDays, data.mfaMaxDays, "تایید وزارت امور خارجه"],
		];
		for (const [min, max, label] of pairs) {
			if (min > max) {
				throw new BadRequestError(`حداقل روزهای ${label} نمی‌تواند بیشتر از حداکثر باشد`);
			}
		}
	}
}

import UrgencyRepository from "../repository/urgency.repository";
import UrgencyTransform from "../transform/urgency.transform";

export default class UrgencyService {
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
}

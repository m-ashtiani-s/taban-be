import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { UpdateClubConfigDto } from "../dto/club.dto";
import ClubConfigRepository from "../repository/clubConfig.repository";
import ClubTransform from "../transform/club.transform";

export default class AdminClubService {
	private clubConfigRepository = new ClubConfigRepository();
	private clubTransform = new ClubTransform();

	async getConfig() {
		const config = await this.clubConfigRepository.getConfig();
		return {
			field: "getClubConfig",
			success: true,
			message: "تنظیمات باشگاه مشتریان با موفقیت دریافت شد",
			data: this.clubTransform.config(config),
		};
	}

	async updateConfig(data: UpdateClubConfigDto) {
		if (!(data.bronzeMinScore < data.silverMinScore && data.silverMinScore < data.goldMinScore)) {
			throw new BadRequestError("آستانه‌های امتیاز باید صعودی باشند: برنزی < نقره‌ای < طلایی");
		}
		const config = await this.clubConfigRepository.updateConfig(data);
		return {
			field: "updateClubConfig",
			success: true,
			message: "تنظیمات باشگاه مشتریان با موفقیت به‌روزرسانی شد",
			data: this.clubTransform.config(config),
		};
	}
}

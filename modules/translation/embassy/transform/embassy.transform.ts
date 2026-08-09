import { EmbassyDocument } from "../model/embassy.model";
import { EmbassyDto } from "../dto/embassy.dto";

export default class EmbassyTransform {
	embassy(embassy: EmbassyDocument): EmbassyDto {

		const loginData: EmbassyDto = {
			embassyId: embassy?._id as string,
			title: embassy?.title,
			isActive: embassy?.isActive,
			description: embassy?.description,
		};
		return loginData;
	}
	embassies(embassies: EmbassyDocument[], orderMap: Record<string, number> = {}): EmbassyDto[] {
		// سفارت‌هایی که ترتیب نمایش دارند اول (صعودی) و بی‌ترتیب‌ها انتها؛ sort پایدار است پس تساوی‌ها ترتیب اصلی را حفظ می‌کنند
		const sorted = [...(embassies ?? [])].sort((a, b) => {
			const aOrder = orderMap[String(a?._id)] ?? Number.MAX_SAFE_INTEGER;
			const bOrder = orderMap[String(b?._id)] ?? Number.MAX_SAFE_INTEGER;
			return aOrder - bOrder;
		});
		return sorted.map((it) => this.embassy(it));
	}
}

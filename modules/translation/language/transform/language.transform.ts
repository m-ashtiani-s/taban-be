import { LanguageDto } from "../dto/language.dto";
import { LanguageDocument } from "../model/language.model";

export default class LanguageTransform {
	language(language: LanguageDocument): LanguageDto {
		const loginData: LanguageDto = {
			languageId: language?._id as string,
			languageName: language?.languageName,
			languageCode: language?.languageCode,
			icon: language?.icon,
			isActive: language?.isActive,
		};
		return loginData;
	}
	languages(languages: LanguageDocument[], orderMap: Record<string, number> = {}): LanguageDto[] {
		// زبان‌هایی که ترتیب نمایش دارند اول (صعودی) و بی‌ترتیب‌ها انتها؛ sort پایدار است پس تساوی‌ها ترتیب اصلی را حفظ می‌کنند
		const sorted = [...(languages ?? [])].sort((a, b) => {
			const aOrder = orderMap[String(a?._id)] ?? Number.MAX_SAFE_INTEGER;
			const bOrder = orderMap[String(b?._id)] ?? Number.MAX_SAFE_INTEGER;
			return aOrder - bOrder;
		});
		return sorted.map((it) => this.language(it));
	}
}

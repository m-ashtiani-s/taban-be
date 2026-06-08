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
	languages(languages: LanguageDocument[]): LanguageDto[] {
		const transformedLanguages: LanguageDto[] = [];
		languages?.map((it) => {
			transformedLanguages.push(this.language(it));
		});
		return transformedLanguages;
	}
}

import { LanguageDocument } from "../../language/model/translationItem.mode";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.mode";
import { BaseRateDto } from "../dto/baseRate.dto";
import { BaseRateDocument } from "../model/baseRate.mode";

export default class TranslationTransform {
	baseRate(baseRate: BaseRateDocument): BaseRateDto {
		const translationItem = baseRate.translationItem as TranslationItemDocument;
		const language = baseRate.language as LanguageDocument;

		return {
			baseRateId: baseRate?._id as string,
			translationItemId: translationItem._id?.toString() || translationItem.toString(),
			translationItemName: translationItem.title || "",
			translationItemIsActive: translationItem.isActive,
			languageId: language._id?.toString() || language.toString(),
			languageName: language.languageName || "",
			languageIsActive: language.isActive ,
			basePrice: baseRate.basePrice,
		};
	}
	baseRates(baseRates: BaseRateDocument[]): BaseRateDto[] {
		const transformedBaseRates: BaseRateDto[] = [];
		baseRates?.map((it) => {
			transformedBaseRates.push(this.baseRate(it));
		});
		return transformedBaseRates;
	}
}

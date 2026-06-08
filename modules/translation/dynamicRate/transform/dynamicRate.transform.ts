import { LanguageDocument } from "../../language/model/language.model";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";
import { DynamicRateDto } from "../dto/dynamicRate.dto";
import { DynamicRateDocument } from "../model/dynamicRate.model";

export default class TranslationTransform {
	dynamicRate(dynamicRate: DynamicRateDocument): DynamicRateDto {
		const translationItem = dynamicRate.translationItem as TranslationItemDocument;
		const language = dynamicRate.language as LanguageDocument;

		return {
			dynamicRateId: dynamicRate._id as string,
			translationItemId: translationItem._id?.toString() || translationItem.toString(),
			translationItemName: translationItem.title || "",
			translationItemIsActive: translationItem.isActive,
			languageId: language._id?.toString() || language.toString(),
			languageName: language.languageName || "",
			languageIsActive: language.isActive,
			price: dynamicRate.price,
			label: dynamicRate.label,
			description: dynamicRate.description,
		};
	}
	dynamicRates(dynamicRates: DynamicRateDocument[]): DynamicRateDto[] {
		const transformedDynamicRates: DynamicRateDto[] = [];
		dynamicRates?.map((it) => {
			transformedDynamicRates.push(this.dynamicRate(it));
		});
		return transformedDynamicRates;
	}
}

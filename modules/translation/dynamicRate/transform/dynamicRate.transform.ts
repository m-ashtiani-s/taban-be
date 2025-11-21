import { LanguageDocument } from "../../language/model/translationItem.mode";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.mode";
import { DynamicRateDto } from "../dto/dynamicRate.dto";
import { DynamicRateOption } from "../dto/dynamicRateOption.dto";
import { DynamicRateDocument } from "../model/dynamicRate.mode";

export default class TranslationTransform {
	dynamicRate(dynamicRate: DynamicRateDocument): DynamicRateDto {
		const translationItem = dynamicRate.translationItem as TranslationItemDocument;
		const language = dynamicRate.language as LanguageDocument;
		const options=dynamicRate.options?.map((it)=>({label:it?.label,optionId:it?._id,price:it?.price}))

		return {
			dynamicRateId: dynamicRate._id as string,
			translationItemId: translationItem._id?.toString() || translationItem.toString(),
			translationItemName: translationItem.title || "",
			languageId: language._id?.toString() || language.toString(),
			languageName: language.languageName || "",
			price: dynamicRate.price,
			inputType: dynamicRate.inputType,
			options:options as DynamicRateOption[],
			label: dynamicRate.label
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

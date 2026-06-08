import { JusticeInquiryDocument } from "../../justiceInquiry/model/justiceInquiry.model";
import { LanguageDocument } from "../../language/model/language.model";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";
import { JusticeInquiryRateDto } from "../dto/justiceInquiry.dto";
import { JusticeInquiryRateDocument } from "../model/justiceInquiryRate.model";

export default class TranslationTransform {
	justiceInquiryRate(justiceInquiryRate: JusticeInquiryRateDocument): JusticeInquiryRateDto {
		const translationItem = justiceInquiryRate.translationItem as TranslationItemDocument;
		const language = justiceInquiryRate.language as LanguageDocument;
		const justiceInquiry = justiceInquiryRate.justiceInquiry as JusticeInquiryDocument;

		return {
			justiceInquiryRateId: justiceInquiryRate._id as string,
			translationItemId: translationItem._id?.toString() || translationItem.toString(),
			translationItemName: translationItem.title || "",
			translationItemIsActive: translationItem.isActive,
			languageId: language._id?.toString() || language.toString(),
			languageName: language.languageName || "",
			languageIsActive: language.isActive ,
			justiceInquiryId: justiceInquiry._id?.toString() || justiceInquiry.toString(),
			justiceInquiryName: justiceInquiry.justiceInquiryName || "",
			justiceInquiryIsActive: justiceInquiry.isActive,
			price: justiceInquiryRate.price,
			isRequired: justiceInquiryRate.isRequired,
		};
	}
	justiceInquiryRates(justiceInquiryRates: JusticeInquiryRateDocument[]): JusticeInquiryRateDto[] {
		const transformedJusticeInquiryRates: JusticeInquiryRateDto[] = [];
		justiceInquiryRates?.map((it) => {
			const justicInquiryRate = this.justiceInquiryRate(it);
			if (justicInquiryRate?.justiceInquiryIsActive) {
				transformedJusticeInquiryRates.push(justicInquiryRate);
			}
		});
		return transformedJusticeInquiryRates;
	}
}

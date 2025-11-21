import {  JusticeInquiryDocument } from "../../justiceInquiry/model/justiceInquiry.mode";
import { LanguageDocument } from "../../language/model/translationItem.mode";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.mode";
import { JusticeInquiryRateDto } from "../dto/justiceInquiry.dto";
import { JusticeInquiryRateDocument } from "../model/justiceInquiryRate.mode";

export default class TranslationTransform {
	justiceInquiryRate(justiceInquiryRate: JusticeInquiryRateDocument): JusticeInquiryRateDto {
		const translationItem = justiceInquiryRate.translationItem as TranslationItemDocument;
		const language = justiceInquiryRate.language as LanguageDocument;
		const justiceInquiry = justiceInquiryRate.justiceInquiry as JusticeInquiryDocument;

		return {
			justiceInquiryRateId: justiceInquiryRate._id as string,
			translationItemId: translationItem._id?.toString() || translationItem.toString(),
			translationItemName: translationItem.title || "",
			languageId: language._id?.toString() || language.toString(),
			languageName: language.languageName || "",
			justiceInquiryId: justiceInquiry._id?.toString() || justiceInquiry.toString(),
			justiceInquiryName: justiceInquiry.justiceInquiryName || "",
			price: justiceInquiryRate.price,
			isRequired: justiceInquiryRate.isRequired
		};
	}
	justiceInquiryRates(justiceInquiryRates: JusticeInquiryRateDocument[]): JusticeInquiryRateDto[] {
		const transformedJusticeInquiryRates: JusticeInquiryRateDto[] = [];
		justiceInquiryRates?.map((it) => {
			transformedJusticeInquiryRates.push(this.justiceInquiryRate(it));
		});
		return transformedJusticeInquiryRates;
	}
}

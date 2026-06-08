import { EmbassyDocument } from "../../embassy/model/embassy.model";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";
import { EmbassyRateDto } from "../dto/embassyRate.dto";
import { EmbassyRateDocument } from "../model/embassyRate.model";

export default class TranslationTransform {
	embassyRate(embassyRate: EmbassyRateDocument): EmbassyRateDto {
		const translationItem = embassyRate.translationItem as TranslationItemDocument;
		const embassy = embassyRate.embassy as EmbassyDocument;

		return {
			embassyRateId: embassyRate._id as string,
			translationItemId: translationItem._id?.toString() || translationItem.toString(),
			translationItemName: translationItem.title || "",
			translationItemIsActive: translationItem.isActive,
			embassyId: embassy._id?.toString() || embassy.toString(),
			embassyName: embassy.title || "",
			embassyIsActive: embassy.isActive,
			price: embassyRate.price,
			isRequired: embassyRate.isRequired,
		};
	}
	embassyRates(embassyRates: EmbassyRateDocument[]): EmbassyRateDto[] {
		const transformedEmbassyRates: EmbassyRateDto[] = [];
		embassyRates?.map((it) => {
			const justicInquiryRate = this.embassyRate(it);
			if (justicInquiryRate?.embassyIsActive) {
				transformedEmbassyRates.push(justicInquiryRate);
			}
		});
		return transformedEmbassyRates;
	}
}

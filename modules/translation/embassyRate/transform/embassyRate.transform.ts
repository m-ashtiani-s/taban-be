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
	embassyRates(embassyRates: EmbassyRateDocument[], orderMap: Record<string, number> = {}): EmbassyRateDto[] {
		// نرخ‌ها بر اساس ترتیبِ نمایشِ سفارتِ متناظر مرتب می‌شوند تا فرانت سفارت‌ها را به همان ترتیب ادمین ببیند
		const sorted = [...(embassyRates ?? [])].sort((a, b) => {
			const aOrder = orderMap[String((a?.embassy as EmbassyDocument)?._id)] ?? Number.MAX_SAFE_INTEGER;
			const bOrder = orderMap[String((b?.embassy as EmbassyDocument)?._id)] ?? Number.MAX_SAFE_INTEGER;
			return aOrder - bOrder;
		});
		const transformedEmbassyRates: EmbassyRateDto[] = [];
		sorted?.map((it) => {
			const justicInquiryRate = this.embassyRate(it);
			if (justicInquiryRate?.embassyIsActive) {
				transformedEmbassyRates.push(justicInquiryRate);
			}
		});
		return transformedEmbassyRates;
	}
}

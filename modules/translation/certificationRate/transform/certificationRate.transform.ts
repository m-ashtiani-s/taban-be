import { LanguageDocument } from "../../language/model/translationItem.mode";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.mode";
import { CertificationRateDto } from "../dto/certificationRate.dto";
import { CertificationRateDocument } from "../model/certificationRate.mode";

export default class TranslationTransform {
	certificationRate(certificationRate: CertificationRateDocument): CertificationRateDto {
		const translationItem = certificationRate.translationItem as TranslationItemDocument;
		const language = certificationRate.language as LanguageDocument;

		return {
			certificationRateId: certificationRate._id as string,
			translationItemId: translationItem._id?.toString() || translationItem.toString(),
			translationItemName: translationItem.title || "",
			languageId: language._id?.toString() || language.toString(),
			languageName: language.languageName || "",
			mfaPrice: certificationRate.mfaPrice,
			justicePrice: certificationRate.justicePrice
		};
	}
	certificationRates(certificationRates: CertificationRateDocument[]): CertificationRateDto[] {
		const transformedCertificationRates: CertificationRateDto[] = [];
		certificationRates?.map((it) => {
			transformedCertificationRates.push(this.certificationRate(it));
		});
		return transformedCertificationRates;
	}
}

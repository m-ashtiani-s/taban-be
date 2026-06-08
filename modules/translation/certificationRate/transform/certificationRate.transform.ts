import { LanguageDocument } from "../../language/model/language.model";
import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";
import { CertificationRateDto } from "../dto/certificationRate.dto";
import { CertificationRateDocument } from "../model/certificationRate.model";

export default class TranslationTransform {
	certificationRate(certificationRate: CertificationRateDocument): CertificationRateDto {
		const translationItem = certificationRate.translationItem as TranslationItemDocument;
		const language = certificationRate.language as LanguageDocument;

		return {
			certificationRateId: certificationRate._id as string,
			translationItemId: translationItem._id?.toString() || translationItem.toString(),
			translationItemName: translationItem.title || "",
			translationItemIsActive: translationItem.isActive,
			languageId: language._id?.toString() || language.toString(),
			languageName: language.languageName || "",
			languageIsActive: language.isActive ,
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

import { RateCalculationResponseDto } from "../dto/rateCalculation.dto";

export default class RateCalculatorTransform {
	response(data: RateCalculationResponseDto): RateCalculationResponseDto {
		return {
			translationItemId: data.translationItemId,
			translationItemTitle: data.translationItemTitle,
			languageId: data.languageId,
			languageName: data.languageName,
			documents: data.documents.map((doc) => ({
				documentKey: doc.documentKey,
				title: doc.title,
				copyCount: doc.copyCount,
				base: {
					baseRateId: doc.base.baseRateId,
					title: doc.base.title,
					unitPrice: doc.base.unitPrice,
					count: doc.base.count,
					total: doc.base.total,
				},
				specials: doc.specials.map((s) => ({
					dynamicRateId: s.dynamicRateId,
					label: s.label,
					unitPrice: s.unitPrice,
					count: s.count,
					total: s.total,
				})),
				specialsTotal: doc.specialsTotal,
				// مجموع هزینه‌ی ترجمه = نرخ پایه + ویژگی‌های داینامیک، تا فرانت آن را به‌صورت یک قلم واحد نمایش دهد
				translationTotal: (doc.base.total ?? 0) + (doc.specialsTotal ?? 0),
				mfaCertification: doc.mfaCertification
					? {
							certificationRateId: doc.mfaCertification.certificationRateId,
							price: doc.mfaCertification.price,
						}
					: null,
				justiceCertification: doc.justiceCertification
					? {
							certificationRateId: doc.justiceCertification.certificationRateId,
							price: doc.justiceCertification.price,
						}
					: null,
				certificationsTotal: doc.certificationsTotal,
				justiceInquiries: doc.justiceInquiries.map((i) => ({
					justiceInquiryRateId: i.justiceInquiryRateId,
					justiceInquiryName: i.justiceInquiryName,
					price: i.price,
				})),
				inquiriesTotal: doc.inquiriesTotal,
				embassyApprovals: doc.embassyApprovals.map((e) => ({
					embassyRateId: e.embassyRateId,
					embassyName: e.embassyName,
					price: e.price,
				})),
				embassyTotal: doc.embassyTotal,
				documentTotal: doc.documentTotal,
			})),
			summary: { ...data.summary },
		};
	}
}

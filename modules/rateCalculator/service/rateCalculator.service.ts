import { BadRequestError } from "../../../shared/base/badRequestError.error";
import BaseRateRepository from "../../translation/baseRate/repository/baseRate.repository";
import CertificationRateRepository from "../../translation/certificationRate/repository/certificationRate.repository";
import DynamicRateRepository from "../../translation/dynamicRate/repository/dynamicRate.repository";
import JusticeInquiryRateRepository from "../../translation/justiceInquiryRate/repository/justiceInquiryRate.repository";
import EmbassyRateRepository from "../../translation/embassyRate/repository/embassyRate.repository";
import LanguageRepository from "../../translation/language/repository/language.repository";
import TranslationItemRepository from "../../translation/translationItem/repository/translationItem.repository";
import {
	RateCalculationDocumentBreakdown,
	RateCalculationRequestDto,
	RateCalculationResponseDto,
	RateCalculationSpecialLine,
} from "../dto/rateCalculation.dto";
import RateCalculatorTransform from "../transform/rateCalculator.transform";

// درصد مالیات؛ فعلاً صفر است (از کاربر مالیات دریافت نمی‌کنیم) ولی قابل تنظیم نگه داشته شده است.
const TAX_PERCENT = 0;

export default class RateCalculatorService {
	private baseRateRepository = new BaseRateRepository();
	private dynamicRateRepository = new DynamicRateRepository();
	private certificationRateRepository = new CertificationRateRepository();
	private justiceInquiryRateRepository = new JusticeInquiryRateRepository();
	private embassyRateRepository = new EmbassyRateRepository();
	private translationItemRepository = new TranslationItemRepository();
	private languageRepository = new LanguageRepository();

	async computeBreakdown(
		request: RateCalculationRequestDto,
		tierDiscountPercent: number = 0
	): Promise<RateCalculationResponseDto> {
		const translationItem = await this.translationItemRepository.findByTranslationItemId(request.translationItemId);
		if (!translationItem) {
			throw new BadRequestError("مدرک انتخاب‌شده یافت نشد");
		}

		const language = await this.languageRepository.findByLanguageId(request.languageId);
		if (!language) {
			throw new BadRequestError("زبان انتخاب‌شده یافت نشد");
		}

		const baseRate = await this.baseRateRepository.findOneBaseRate({
			translationItemId: request.translationItemId,
			languageId: request.languageId,
		});
		if (!baseRate) {
			throw new BadRequestError("نرخ پایه‌ای برای این مدرک و زبان ثبت نشده است");
		}

		// نرخ پایه‌ی واحد شامل خود نرخ پایه به‌علاوه‌ی سنام، هزینه دفتری، نرخ برابر اصل (تصدیق)
		// و مهر مترجم است که همگی در مدل baseRate نگهداری می‌شوند.
		const baseUnitPrice =
			(baseRate.basePrice ?? 0) +
			(baseRate.sanamPrice ?? 0) +
			(baseRate.daftariPrice ?? 0) +
			(baseRate.tasdighPrice ?? 0) +
			(baseRate.mohrPrice ?? 0);

		const documents: RateCalculationDocumentBreakdown[] = [];

		for (const doc of request.documents) {
			const baseTotal = baseUnitPrice * doc.baseRateCount;

			const specialLines: RateCalculationSpecialLine[] = [];
			for (const sp of doc.specials) {
				if (sp.count <= 0) continue;
				const dynamicRate = await this.dynamicRateRepository.findByDynamicRateId(sp.dynamicRateId);
				if (!dynamicRate) {
					throw new BadRequestError("نرخ خاص انتخاب‌شده یافت نشد");
				}
				specialLines.push({
					dynamicRateId: sp.dynamicRateId,
					label: dynamicRate.label,
					unitPrice: dynamicRate.price,
					count: sp.count,
					total: dynamicRate.price * sp.count,
				});
			}
			const specialsTotal = specialLines.reduce((sum, line) => sum + line.total, 0);

			let mfaCertification = null;
			if (doc.mfaCertificationRateId) {
				const cert = await this.certificationRateRepository.findByCertificationRateId(doc.mfaCertificationRateId);
				if (!cert) {
					throw new BadRequestError("نرخ تایید وزارت خارجه یافت نشد");
				}
				mfaCertification = {
					certificationRateId: doc.mfaCertificationRateId,
					price: cert.mfaPrice,
				};
			}

			let justiceCertification = null;
			if (doc.justiceCertificationRateId) {
				const cert = await this.certificationRateRepository.findByCertificationRateId(doc.justiceCertificationRateId);
				if (!cert) {
					throw new BadRequestError("نرخ تایید دادگستری یافت نشد");
				}
				justiceCertification = {
					certificationRateId: doc.justiceCertificationRateId,
					price: cert.justicePrice,
				};
			}
			const certificationsTotal = (mfaCertification?.price ?? 0) + (justiceCertification?.price ?? 0);

			const justiceInquiries = [];
			for (const inquiryId of doc.justiceInquiryRateIds) {
				const inquiry = await this.justiceInquiryRateRepository.findByJusticeInquiryRateId(inquiryId, [
					"justiceInquiry",
				]);
				if (!inquiry) {
					throw new BadRequestError("استعلام انتخاب‌شده یافت نشد");
				}
				const inquiryRef: any = inquiry.justiceInquiry;
				justiceInquiries.push({
					justiceInquiryRateId: inquiryId,
					justiceInquiryName: inquiryRef?.justiceInquiryName ?? "",
					price: inquiry.price,
				});
			}
			const inquiriesTotal = justiceInquiries.reduce((sum, line) => sum + line.price, 0);

			const embassyApprovals = [];
			for (const embassyRateId of doc.embassyRateIds ?? []) {
				const embassyRate = await this.embassyRateRepository.findByEmbassyRateId(embassyRateId, ["embassy"]);
				if (!embassyRate) {
					throw new BadRequestError("تایید سفارت انتخاب‌شده یافت نشد");
				}
				const embassyRef: any = embassyRate.embassy;
				embassyApprovals.push({
					embassyRateId,
					embassyName: embassyRef?.title ?? "",
					price: embassyRate.price,
				});
			}
			const embassyTotal = embassyApprovals.reduce((sum, line) => sum + line.price, 0);

			// تعداد نسخه‌ی این مدرک (پیش‌فرض ۱). در نسخه‌های اضافه هزینه‌ی ترجمه (پایه + داینامیک)
			// ثابت می‌ماند و فقط تاییدات، استعلام‌ها و تایید سفارت به ازای هر نسخه دریافت می‌شوند.
			const copyCount = doc.copyCount && doc.copyCount > 0 ? doc.copyCount : 1;
			const perCopyExtras = certificationsTotal + inquiriesTotal + embassyTotal;
			const documentTotal = baseTotal + specialsTotal + perCopyExtras * copyCount;

			documents.push({
				documentKey: doc.documentKey,
				title: doc.title,
				copyCount,
				base: {
					baseRateId: baseRate._id as string,
					title: baseRate.title,
					unitPrice: baseRate.basePrice,
					count: doc.baseRateCount,
					total: baseTotal,
				},
				specials: specialLines,
				specialsTotal,
				mfaCertification,
				justiceCertification,
				certificationsTotal,
				justiceInquiries,
				inquiriesTotal,
				embassyApprovals,
				embassyTotal,
				documentTotal,
			});
		}

		const translationPrice = documents.reduce(
			(sum, d) => sum + d.base.total + d.specialsTotal,
			0,
		);
		const certificationPrice = documents.reduce((sum, d) => sum + d.certificationsTotal * d.copyCount, 0);
		const inquiryPrice = documents.reduce((sum, d) => sum + d.inquiriesTotal * d.copyCount, 0);
		const embassyPrice = documents.reduce((sum, d) => sum + d.embassyTotal * d.copyCount, 0);
		// تخفیف باشگاه مشتریان فقط روی مبلغ ترجمه (پایه + داینامیک‌ها) اعمال می‌شود
		const safeDiscountPercent = Math.min(Math.max(tierDiscountPercent || 0, 0), 100);
		const tierDiscountAmount = Math.round((translationPrice * safeDiscountPercent) / 100);
		const subtotal = translationPrice - tierDiscountAmount + certificationPrice + inquiryPrice + embassyPrice;
		const taxPrice = Math.round((subtotal * TAX_PERCENT) / 100);
		const totalPrice = subtotal + taxPrice;

		return new RateCalculatorTransform().response({
			translationItemId: request.translationItemId,
			translationItemTitle: translationItem.title,
			languageId: request.languageId,
			languageName: language.languageName,
			documents,
			summary: {
				translationPrice,
				certificationPrice,
				inquiryPrice,
				embassyPrice,
				subtotal,
				taxPercent: TAX_PERCENT,
				taxPrice,
				totalPrice,
				tierDiscountPercent: safeDiscountPercent,
				tierDiscountAmount,
			},
		});
	}

	async calculate(request: RateCalculationRequestDto, tierDiscountPercent: number = 0) {
		const response = await this.computeBreakdown(request, tierDiscountPercent);
		return {
			field: "calculateRate",
			success: true,
			data: response,
			message: "محاسبه نرخ با موفقیت انجام شد",
		};
	}
}

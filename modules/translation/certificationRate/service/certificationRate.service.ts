import mongoose from "mongoose";
import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../../shared/base/notFoundError.error";
import LanguageRepository from "../../language/repositories/language.repository";
import TranslationItemRepository from "../../translationItem/repositories/translation.repository";
import { GetCertificationRatesFilters } from "../dto/certificationRateFilters.dto";
import { CertificationRatesUpdateList } from "../dto/certificationRatesUpdateList.dto";
import { CertificationRateUpdateDto } from "../dto/certificationRateUpdate.dto";
import CertificationRateRepository from "../repositories/certificationRate.repository";
import CertificationRateTransform from "../transform/certificationRate.transform";

export default class CertificationRateService {
	private certificationRateRepository = new CertificationRateRepository();
	private languageRepository = new LanguageRepository();
	private translationItemRepository = new TranslationItemRepository();

	async createCertificationRate(translationItemId: string, languageId: string, mfaPrice: number, justicePrice: number) {
		const language = await this.languageRepository.findByLanguageId(languageId);
		if (!language) {
			throw new NotFoundError("زبان مورد نظر وجود ندارد");
		}

		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new NotFoundError("مدرک مورد نظر وجود ندارد");
		}

		await this.certificationRateRepository.createCertificationRate({
			translationItem: translationItemId,
			language: languageId,
			mfaPrice,
			justicePrice,
		});
		return {
			field: "createCertificationRate",
			success: true,
			message: "نرخ تاییدیه با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getCertificationRates(filters: GetCertificationRatesFilters) {
		const certificationRates = await this.certificationRateRepository.findCertificationRates(filters, ["translationItem", "language"]);
		if (!certificationRates) {
			throw new BadRequestError("مشکلی در یافتن نرخ های تاییدیه بوجود آمد");
		}
		return {
			field: "getCertificationRates",
			success: true,
			message: "لیست نرخ های تاییدیه با موفقیت دریافت شد",
			data: new CertificationRateTransform().certificationRates(certificationRates),
		};
	}
	async getCertificationRate(certificationRateId: string) {
		const certificationRate = await this.certificationRateRepository.findByCertificationRateId(certificationRateId, [
			"translationItem",
			"language",
		]);
		if (!certificationRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ تاییدیه بوجود آمد");
		}
		return {
			field: "getCertificationRate",
			success: true,
			message: "نرخ تاییدیه با موفقیت دریافت شد",
			data: new CertificationRateTransform().certificationRate(certificationRate),
		};
	}
	async deleteCertificationRate(certificationRateId: string) {
		const certificationRate = await this.certificationRateRepository.findByCertificationRateId(certificationRateId);
		if (!certificationRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ تاییدیه بوجود آمد");
		}
		await this.certificationRateRepository.deleteCertificationRate(certificationRate);
		return {
			field: "deleteCertificationRate",
			success: true,
			message: "نرخ تاییدیه با موفقیت حذف شد",
			data: null,
		};
	}
	async updateCertificationRate(certificationRateId: string, updateCertificationRateData: CertificationRateUpdateDto) {
		const certificationRate = await this.certificationRateRepository.findByCertificationRateId(certificationRateId);
		if (!certificationRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ تاییدیه بوجود آمد");
		}
		await this.certificationRateRepository.updateCertificationRate(certificationRate, {
			...updateCertificationRateData,
		});

		return {
			field: "updateCertificationRatePrice",
			success: true,
			data: null,
			message: "نرخ تاییدیه با موفقیت به روز شد",
		};
	}
	async bulkUpdateCertificationRatePrice(certificationRatesUpdateList: CertificationRatesUpdateList[]) {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			for (const { certificationRateId, mfaPrice,justicePrice } of certificationRatesUpdateList) {
				const certificationRate = await this.certificationRateRepository.findByCertificationRateId(certificationRateId, undefined, session);
				if (!certificationRate) {
					throw new BadRequestError(`نرخ تاییدیه با شناسه ${certificationRateId} یافت نشد`);
				}

				certificationRate.mfaPrice = mfaPrice;
				certificationRate.justicePrice = justicePrice;
				await certificationRate.save({ session });
			}

			await session.commitTransaction();
			session.endSession();

			return {
				field: "bulkUpdateCertificationRatePrice",
				success: true,
				data: null,
				message: "تمام نرخ‌های تاییدیه با موفقیت به روز شدند",
			};
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	}
}

import mongoose from "mongoose";
import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../../shared/base/notFoundError.error";
import JusticeInquiryRepository from "../../justiceInquiry/repository/justiceInquiry.repository";
import LanguageRepository from "../../language/repository/language.repository";
import TranslationItemRepository from "../../translationItem/repository/translation.repository";
import { GetJusticeInquiryRatesFilters } from "../dto/justiceInquiryRateFilters.dto";
import JusticeInquiryRateRepository from "../repository/justiceInquiryRate.repository";
import JusticeInquiryRateTransform from "../transform/justiceInquiryRate.transform";
import { JusticeInquiryRatesUpdateList } from "../dto/justiceInquiryRatesUpdateList.dto";

export default class JusticeInquiryRateService {
	private justiceInquiryRateRepository = new JusticeInquiryRateRepository();
	private languageRepository = new LanguageRepository();
	private translationItemRepository = new TranslationItemRepository();
	private justiceInquiryRepository = new JusticeInquiryRepository();

	async createJusticeInquiryRate(translationItemId: string, languageId: string, justiceInquiryId: string, price: number) {
		const language = await this.languageRepository.findByLanguageId(languageId);
		if (!language) {
			throw new NotFoundError("زبان مورد نظر وجود ندارد");
		}

		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new NotFoundError("مدرک مورد نظر وجود ندارد");
		}

		const justiceInquiry = await this.justiceInquiryRepository.findByJusticeInquiryId(justiceInquiryId);
		if (!justiceInquiry) {
			throw new NotFoundError("استعلام مورد نظر وجود ندارد");
		}

		await this.justiceInquiryRateRepository.createJusticeInquiryRate({
			translationItem: translationItemId,
			language: languageId,
			justiceInquiry: justiceInquiryId,
			price,
			isRequired: false,
		});
		return {
			field: "createJusticeInquiryRate",
			success: true,
			message: "نرخ استعلام با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getJusticeInquiryRates(filters: GetJusticeInquiryRatesFilters) {
		const justiceInquiryRates = await this.justiceInquiryRateRepository.findJusticeInquiryRates(filters, [
			"translationItem",
			"language",
			"justiceInquiry",
		]);
		if (!justiceInquiryRates) {
			throw new BadRequestError("مشکلی در یافتن نرخ های استعلام بوجود آمد");
		}
		return {
			field: "getJusticeInquiryRates",
			success: true,
			message: "لیست نرخ های استعلام با موفقیت دریافت شد",
			data: new JusticeInquiryRateTransform().justiceInquiryRates(justiceInquiryRates),
		};
	}
	async getJusticeInquiryRate(justiceInquiryRateId: string) {
		const justiceInquiryRate = await this.justiceInquiryRateRepository.findByJusticeInquiryRateId(justiceInquiryRateId, [
			"translationItem",
			"language",
			"justiceInquiry",
		]);
		if (!justiceInquiryRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ استعلام بوجود آمد");
		}
		return {
			field: "getJusticeInquiryRate",
			success: true,
			message: "نرخ استعلام با موفقیت دریافت شد",
			data: new JusticeInquiryRateTransform().justiceInquiryRate(justiceInquiryRate),
		};
	}
	async deleteJusticeInquiryRate(justiceInquiryRateId: string) {
		const justiceInquiryRate = await this.justiceInquiryRateRepository.findByJusticeInquiryRateId(justiceInquiryRateId);
		if (!justiceInquiryRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ استعلام بوجود آمد");
		}
		await this.justiceInquiryRateRepository.deleteJusticeInquiryRate(justiceInquiryRate);
		return {
			field: "deleteJusticeInquiryRate",
			success: true,
			message: "نرخ استعلام با موفقیت حذف شد",
			data: null,
		};
	}
	async updateJusticeInquiryRatePrice(justiceInquiryRateId: string, price: number) {
		const justiceInquiryRate = await this.justiceInquiryRateRepository.findByJusticeInquiryRateId(justiceInquiryRateId);
		if (!justiceInquiryRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ استعلام بوجود آمد");
		}
		await this.justiceInquiryRateRepository.updateJusticeInquiryRate(justiceInquiryRate, {
			price,
		});

		return {
			field: "updateJusticeInquiryRatePrice",
			success: true,
			data: null,
			message: "نرخ استعلام با موفقیت به روز شد",
		};
	}
	async bulkUpdateJusticeInquiryRatePrice(justiceInquiryRatesUpdateList: JusticeInquiryRatesUpdateList[]) {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			for (const { justiceInquiryRateId, price } of justiceInquiryRatesUpdateList) {
				const justiceInquiryRate = await this.justiceInquiryRateRepository.findByJusticeInquiryRateId(justiceInquiryRateId, undefined, session);
				if (!justiceInquiryRate) {
					throw new BadRequestError(`نرخ استعلام با شناسه ${justiceInquiryRateId} یافت نشد`);
				}

				justiceInquiryRate.price = price;
				await justiceInquiryRate.save({ session });
			}

			await session.commitTransaction();
			session.endSession();

			return {
				field: "bulkUpdateJusticeInquiryRatePrice",
				success: true,
				data: null,
				message: "تمام نرخ‌های استعلام با موفقیت به روز شدند",
			};
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	}
}

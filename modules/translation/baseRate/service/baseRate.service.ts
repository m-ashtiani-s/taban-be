import mongoose from "mongoose";
import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../../shared/base/notFoundError.error";
import LanguageRepository from "../../language/repositories/language.repository";
import TranslationItemRepository from "../../translationItem/repositories/translation.repository";
import { GetBaseRatesFilters } from "../dto/baseRateFilters.dto";
import BaseRateRepository from "../repositories/baseRate.repository";
import BaseRateTransform from "../transform/baseRate.transform";
import { BaseRatesUpdateList } from "../dto/baseRatesUpdateList.dto";

export default class BaseRateService {
	private baseRateRepository = new BaseRateRepository();
	private languageRepository = new LanguageRepository();
	private translationItemRepository = new TranslationItemRepository();

	async createBaseRate(translationItemId: string, languageId: string, basePrice: number) {
		const language = await this.languageRepository.findByLanguageId(languageId);
		if (!language) {
			throw new NotFoundError("زبان مورد نظر وجود ندارد");
		}

		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new NotFoundError("مدرک مورد نظر وجود ندارد");
		}

		const baseRate = await this.baseRateRepository.findOneBaseRate({ translationItemId, languageId });
		if (baseRate) {
			throw new BadRequestError("یک نرخ پایه با این زبان و مدرک وجود دارد");
		}

		await this.baseRateRepository.createBaseRate({
			translationItem: translationItemId,
			language: languageId,
			basePrice,
		});
		return {
			field: "createBaseRate",
			success: true,
			message: "نرخ پایه با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getBaseRates(filters: GetBaseRatesFilters) {
		const baseRates = await this.baseRateRepository.findBaseRates(filters, ["translationItem", "language"]);
		if (!baseRates) {
			throw new BadRequestError("مشکلی در یافتن نرخ پایه ها بوجود آمد");
		}
		return {
			field: "getBaseRates",
			success: true,
			message: "لیست نرخ پایه ها با موفقیت دریافت شد",
			data: new BaseRateTransform().baseRates(baseRates),
		};
	}
	async getBaseRate(baseRateId: string) {
		const baseRate = await this.baseRateRepository.findByBaseRateId(baseRateId, ["translationItem", "language"]);
		if (!baseRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ پایه بوجود آمد");
		}
		return {
			field: "getBaseRate",
			success: true,
			message: "نرخ پایه با موفقیت دریافت شد",
			data: new BaseRateTransform().baseRate(baseRate),
		};
	}
	async deleteBaseRate(baseRateId: string) {
		const baseRate = await this.baseRateRepository.findByBaseRateId(baseRateId);
		if (!baseRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ پایه بوجود آمد");
		}
		await this.baseRateRepository.deleteBaseRate(baseRate);
		return {
			field: "deleteBaseRate",
			success: true,
			message: "نرخ پایه با موفقیت حذف شد",
			data: null,
		};
	}
	async updateBaseRatePrice(baseRateId: string, basePrice: number) {
		const baseRate = await this.baseRateRepository.findByBaseRateId(baseRateId);
		if (!baseRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ پایه بوجود آمد");
		}
		await this.baseRateRepository.updateBaseRate(baseRate, {
			basePrice,
		});

		return {
			field: "updateBaseRatePrice",
			success: true,
			data: null,
			message: "نرخ پایه با موفقیت به روز شد",
		};
	}
	async bulkUpdateBaseRatePrice(baseRatesUpdateList: BaseRatesUpdateList[]) {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			for (const { baseRateId, basePrice } of baseRatesUpdateList) {
				const baseRate = await this.baseRateRepository.findByBaseRateId(baseRateId, undefined, session);
				if (!baseRate) {
					throw new BadRequestError(`نرخ پایه با شناسه ${baseRateId} یافت نشد`);
				}

				baseRate.basePrice = basePrice;
				await baseRate.save({ session });
			}

			await session.commitTransaction();
			session.endSession();

			return {
				field: "bulkUpdateBaseRatePrice",
				success: true,
				data: null,
				message: "تمام نرخ‌های پایه با موفقیت به روز شدند",
			};
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	}
}

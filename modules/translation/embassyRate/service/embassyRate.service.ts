import mongoose from "mongoose";
import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../../shared/base/notFoundError.error";
import EmbassyRepository from "../../embassy/repositories/embassy.repository";
import TranslationItemRepository from "../../translationItem/repositories/translation.repository";
import { GetEmbassyRatesFilters } from "../dto/embassyRateFilters.dto";
import EmbassyRateRepository from "../repositories/embassyRate.repository";
import EmbassyRateTransform from "../transform/embassyRate.transform";
import { EmbassyRatesUpdateList } from "../dto/embassyRatesUpdateList.dto";

export default class EmbassyRateService {
	private embassyRateRepository = new EmbassyRateRepository();
	private translationItemRepository = new TranslationItemRepository();
	private embassyRepository = new EmbassyRepository();

	async createEmbassyRate(translationItemId: string, embassyId: string, price: number) {

		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new NotFoundError("مدرک مورد نظر وجود ندارد");
		}

		const embassy = await this.embassyRepository.findByEmbassyId(embassyId);
		if (!embassy) {
			throw new NotFoundError("سفارت مورد نظر وجود ندارد");
		}

		await this.embassyRateRepository.createEmbassyRate({
			translationItem: translationItemId,
			embassy: embassyId,
			price,
			isRequired: false,
		});
		return {
			field: "createEmbassyRate",
			success: true,
			message: "نرخ سفارت با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getEmbassyRates(filters: GetEmbassyRatesFilters) {
		const embassyRates = await this.embassyRateRepository.findEmbassyRates(filters, [
			"translationItem",
			"embassy",
		]);
		if (!embassyRates) {
			throw new BadRequestError("مشکلی در یافتن نرخ های سفارت بوجود آمد");
		}
		return {
			field: "getEmbassyRates",
			success: true,
			message: "لیست نرخ های سفارت با موفقیت دریافت شد",
			data: new EmbassyRateTransform().embassyRates(embassyRates),
		};
	}
	async getEmbassyRate(embassyRateId: string) {
		const embassyRate = await this.embassyRateRepository.findByEmbassyRateId(embassyRateId, [
			"translationItem",
			"embassy",
		]);
		if (!embassyRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ سفارت بوجود آمد");
		}
		return {
			field: "getEmbassyRate",
			success: true,
			message: "نرخ سفارت با موفقیت دریافت شد",
			data: new EmbassyRateTransform().embassyRate(embassyRate),
		};
	}
	async deleteEmbassyRate(embassyRateId: string) {
		const embassyRate = await this.embassyRateRepository.findByEmbassyRateId(embassyRateId);
		if (!embassyRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ سفارت بوجود آمد");
		}
		await this.embassyRateRepository.deleteEmbassyRate(embassyRate);
		return {
			field: "deleteEmbassyRate",
			success: true,
			message: "نرخ سفارت با موفقیت حذف شد",
			data: null,
		};
	}
	async updateEmbassyRatePrice(embassyRateId: string, price: number) {
		const embassyRate = await this.embassyRateRepository.findByEmbassyRateId(embassyRateId);
		if (!embassyRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ سفارت بوجود آمد");
		}
		await this.embassyRateRepository.updateEmbassyRate(embassyRate, {
			price,
		});

		return {
			field: "updateEmbassyRatePrice",
			success: true,
			data: null,
			message: "نرخ سفارت با موفقیت به روز شد",
		};
	}
	async bulkUpdateEmbassyRatePrice(embassyRatesUpdateList: EmbassyRatesUpdateList[]) {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			for (const { embassyRateId, price } of embassyRatesUpdateList) {
				const embassyRate = await this.embassyRateRepository.findByEmbassyRateId(embassyRateId, undefined, session);
				if (!embassyRate) {
					throw new BadRequestError(`نرخ سفارت با شناسه ${embassyRateId} یافت نشد`);
				}

				embassyRate.price = price;
				await embassyRate.save({ session });
			}

			await session.commitTransaction();
			session.endSession();

			return {
				field: "bulkUpdateEmbassyRatePrice",
				success: true,
				data: null,
				message: "تمام نرخ‌های سفارت با موفقیت به روز شدند",
			};
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	}
}

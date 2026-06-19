import mongoose from "mongoose";
import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../../shared/base/notFoundError.error";
import TranslationItemRepository from "../../translationItem/repository/translationItem.repository";
import { GetScanRatesFilters } from "../dto/scanRateFilters.dto";
import ScanRateRepository from "../repository/scanRate.repository";
import ScanRateTransform from "../transform/scanRate.transform";
import { ScanRatesUpdateList } from "../dto/scanRatesUpdateList.dto";

export default class ScanRateService {
	private scanRateRepository = new ScanRateRepository();
	private translationItemRepository = new TranslationItemRepository();

	async createScanRate(translationItemId: string, price: number) {
		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new NotFoundError("مدرک مورد نظر وجود ندارد");
		}

		await this.scanRateRepository.createScanRate({
			translationItem: translationItemId,
			price,
		});

		return {
			field: "createScanRate",
			success: true,
			message: "نرخ اسکن با موفقیت ایجاد شد",
			data: null,
		};
	}

	async getScanRates(filters: GetScanRatesFilters) {
		const scanRates = await this.scanRateRepository.findScanRates(filters, ["translationItem"]);
		if (!scanRates) {
			throw new BadRequestError("مشکلی در یافتن نرخ های اسکن بوجود آمد");
		}
		return {
			field: "getScanRates",
			success: true,
			message: "لیست نرخ های اسکن با موفقیت دریافت شد",
			data: new ScanRateTransform().scanRates(scanRates),
		};
	}

	async getScanRate(scanRateId: string) {
		const scanRate = await this.scanRateRepository.findByScanRateId(scanRateId, ["translationItem"]);
		if (!scanRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ اسکن بوجود آمد");
		}
		return {
			field: "getScanRate",
			success: true,
			message: "نرخ اسکن با موفقیت دریافت شد",
			data: new ScanRateTransform().scanRate(scanRate),
		};
	}

	async deleteScanRate(scanRateId: string) {
		const scanRate = await this.scanRateRepository.findByScanRateId(scanRateId);
		if (!scanRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ اسکن بوجود آمد");
		}
		await this.scanRateRepository.deleteScanRate(scanRate);
		return {
			field: "deleteScanRate",
			success: true,
			message: "نرخ اسکن با موفقیت حذف شد",
			data: null,
		};
	}

	async updateScanRatePrice(scanRateId: string, price: number) {
		const scanRate = await this.scanRateRepository.findByScanRateId(scanRateId);
		if (!scanRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ اسکن بوجود آمد");
		}
		await this.scanRateRepository.updateScanRate(scanRate, { price });
		return {
			field: "updateScanRatePrice",
			success: true,
			data: null,
			message: "نرخ اسکن با موفقیت به روز شد",
		};
	}

	async bulkUpdateScanRatePrice(scanRatesUpdateList: ScanRatesUpdateList[]) {
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			for (const { scanRateId, price } of scanRatesUpdateList) {
				const scanRate = await this.scanRateRepository.findByScanRateId(scanRateId, undefined, session);
				if (!scanRate) {
					throw new BadRequestError(`نرخ اسکن با شناسه ${scanRateId} یافت نشد`);
				}
				scanRate.price = price;
				await scanRate.save({ session });
			}

			await session.commitTransaction();
			session.endSession();

			return {
				field: "bulkUpdateScanRatePrice",
				success: true,
				data: null,
				message: "تمام نرخ‌های اسکن با موفقیت به روز شدند",
			};
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	}
}

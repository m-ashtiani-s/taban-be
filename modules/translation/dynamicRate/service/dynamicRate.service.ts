import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../../shared/base/notFoundError.error";
import LanguageRepository from "../../language/repositories/language.repository";
import TranslationItemRepository from "../../translationItem/repositories/translation.repository";
import { GetDynamicRatesFilters } from "../dto/dynamicRateFilters.dto";
import { DynamicRateInputType } from "../dto/dynamicRateInputType.dto";
import { DynamicRateOption } from "../dto/dynamicRateOption.dto";
import { DynamicRateUpdateDto } from "../dto/dynamicRateUpdate.dto";
import DynamicRateRepository from "../repositories/dynamicRate.repository";
import DynamicRateTransform from "../transform/dynamicRate.transform";

export default class DynamicRateService {
	private dynamicRateRepository = new DynamicRateRepository();
	private languageRepository = new LanguageRepository();
	private translationItemRepository = new TranslationItemRepository();

	async createDynamicRate(
		translationItemId: string,
		languageId: string,
		price: number,
		label: string,
		inputType: DynamicRateInputType,
		options: DynamicRateOption[]
	) {
		const language = await this.languageRepository.findByLanguageId(languageId);
		if (!language) {
			throw new NotFoundError("زبان مورد نظر وجود ندارد");
		}

		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new NotFoundError("مدرک مورد نظر وجود ندارد");
		}

		await this.dynamicRateRepository.createDynamicRate({
			translationItem: translationItemId,
			language: languageId,
			price,
			label,
			inputType,
			options,
		});
		return {
			field: "createDynamicRate",
			success: true,
			message: "نرخ خاص با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getDynamicRates(filters: GetDynamicRatesFilters) {
		const dynamicRates = await this.dynamicRateRepository.findDynamicRates(filters, ["translationItem", "language"]);
		if (!dynamicRates) {
			throw new BadRequestError("مشکلی در یافتن نرخ خاص ها بوجود آمد");
		}
		return {
			field: "getDynamicRates",
			success: true,
			message: "لیست نرخ خاص ها با موفقیت دریافت شد",
			data: new DynamicRateTransform().dynamicRates(dynamicRates),
		};
	}
	async getDynamicRate(dynamicRateId: string) {
		const dynamicRate = await this.dynamicRateRepository.findByDynamicRateId(dynamicRateId, ["translationItem", "language"]);
		if (!dynamicRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ خاص بوجود آمد");
		}
		return {
			field: "getDynamicRate",
			success: true,
			message: "نرخ خاص با موفقیت دریافت شد",
			data: new DynamicRateTransform().dynamicRate(dynamicRate),
		};
	}
	async deleteDynamicRate(dynamicRateId: string) {
		const dynamicRate = await this.dynamicRateRepository.findByDynamicRateId(dynamicRateId);
		if (!dynamicRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ خاص بوجود آمد");
		}
		await this.dynamicRateRepository.deleteDynamicRate(dynamicRate);
		return {
			field: "deleteDynamicRate",
			success: true,
			message: "نرخ خاص با موفقیت حذف شد",
			data: null,
		};
	}
	async updateDynamicRatePrice(dynamicRateId: string, price: number) {
		const dynamicRate = await this.dynamicRateRepository.findByDynamicRateId(dynamicRateId);
		if (!dynamicRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ خاص بوجود آمد");
		}
		await this.dynamicRateRepository.updateDynamicRate(dynamicRate, {
			price,
		});

		return {
			field: "updateDynamicRatePrice",
			success: true,
			data: null,
			message: "نرخ خاص با موفقیت به روز شد",
		};
	}
	async updateDynamicRate(dynamicRateId: string, updateDynamicRateData: DynamicRateUpdateDto) {
		const dynamicRate = await this.dynamicRateRepository.findByDynamicRateId(dynamicRateId);
		if (!dynamicRate) {
			throw new BadRequestError("مشکلی در یافتن نرخ خاص بوجود آمد");
		}
		await this.dynamicRateRepository.updateDynamicRate(dynamicRate, {
			...updateDynamicRateData,
		});

		return {
			field: "updateDynamicRatePrice",
			success: true,
			data: null,
			message: "نرخ خاص با موفقیت به روز شد",
		};
	}
}

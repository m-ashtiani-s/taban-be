import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import OrderRepository from "../../../order/repository/order.repository";
import BaseRateRepository from "../../baseRate/repository/baseRate.repository";
import CertificationRateRepository from "../../certificationRate/repository/certificationRate.repository";
import DynamicRateRepository from "../../dynamicRate/repository/dynamicRate.repository";
import JusticeInquiryRateRepository from "../../justiceInquiryRate/repository/justiceInquiryRate.repository";
import { LanguageOrderDto } from "../../languageOrder/dto/languageOrder.dto";
import LanguageOrderService from "../../languageOrder/service/languageOrder.service";
import { GetLanguagesFilters } from "../dto/getLanguagesFilters.dto";
import { LanguageUpdateDto } from "../dto/languageUpdate.dto";
import LanguageRepository from "../repository/language.repository";
import LanguageTransform from "../transform/language.transform";

export default class LanguageService {
	private languageRepository = new LanguageRepository();
	private languageOrderService = new LanguageOrderService();
	private baseRateRepository = new BaseRateRepository();
	private certificationRateRepository = new CertificationRateRepository();
	private dynamicRateRepository = new DynamicRateRepository();
	private justiceInquiryRateRepository = new JusticeInquiryRateRepository();
	private orderRepository = new OrderRepository();

	async createLanguage(languageName: string, languageCode: string, icon: string) {
		const language = await this.languageRepository.findLanguageByTitle(languageName);
		if (language) {
			throw new BadRequestError("یک زبان با این عنوان وجود دارد");
		}
		const languageByDocumentType = await this.languageRepository.findLanguageByLanguageCode(languageCode);
		if (languageByDocumentType) {
			throw new BadRequestError("یک زبان با این نوع وجود دارد");
		}
		await this.languageRepository.createLanguage({
			languageName,
			languageCode,
			icon,
			isActive: true,
		});
		return {
			field: "createLanguage",
			success: true,
			message: "زبان با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getLanguages(filters: GetLanguagesFilters) {
		const languages = await this.languageRepository.findLanguages(filters);
		if (!languages) {
			throw new BadRequestError("مشکلی در یافتن زبان ها بوجود آمد");
		}
		const orderMap = await this.languageOrderService.getOrderMap();
		return {
			field: "getLanguages",
			success: true,
			message: "لیست زبان ها با موفقیت دریافت شد",
			data: new LanguageTransform().languages(languages, orderMap),
		};
	}
	async reorderLanguages(orders: LanguageOrderDto[]) {
		return this.languageOrderService.setLanguagesOrder(orders);
	}
	async getLanguage(languageId: string, isActive?: boolean) {
		const language = await this.languageRepository.findOneLanguage(languageId, isActive);
		if (!language) {
			throw new BadRequestError("مشکلی در یافتن زبان بوجود آمد");
		}
		return {
			field: "getLanguage",
			success: true,
			message: "زبان با موفقیت دریافت شد",
			data: new LanguageTransform().language(language),
		};
	}
	async activateLanguage(languageId: string) {
		const language = await this.languageRepository.findByLanguageId(languageId);
		if (!language) {
			throw new BadRequestError("مشکلی در یافتن زبان بوجود آمد");
		}
		await this.languageRepository.updateLanguage(language, {
			isActive: true,
		});

		return {
			field: "activateLanguage",
			success: true,
			data: null,
			message: "زبان با موفقیت فعال شد",
		};
	}
	async deactivateLanguage(languageId: string) {
		const language = await this.languageRepository.findByLanguageId(languageId);
		if (!language) {
			throw new BadRequestError("مشکلی در یافتن زبان بوجود آمد");
		}
		await this.languageRepository.updateLanguage(language, {
			isActive: false,
		});

		return {
			field: "deactivateLanguage",
			success: true,
			data: null,
			message: "زبان با موفقیت غیرفعال شد",
		};
	}
	async updateLanguage(languageId: string, updateTlanguageData: LanguageUpdateDto) {
		const language = await this.languageRepository.findByLanguageId(languageId);
		if (!language) {
			throw new BadRequestError("مشکلی در یافتن زبان بوجود آمد");
		}
		await this.languageRepository.updateLanguage(language, {
			...updateTlanguageData,
		});

		return {
			field: "updateLanguage",
			success: true,
			data: null,
			message: "زبان با موفقیت به روز شد",
		};
	}
	async deleteLanguage(languageId: string) {
		const language = await this.languageRepository.findByLanguageId(languageId);
		if (!language) {
			throw new BadRequestError("مشکلی در یافتن زبان بوجود آمد");
		}

		const [hasBaseRate, hasCertificationRate, hasDynamicRate, hasJusticeInquiryRate, hasOrder] = await Promise.all([
			this.baseRateRepository.existsByLanguage(languageId),
			this.certificationRateRepository.existsByLanguage(languageId),
			this.dynamicRateRepository.existsByLanguage(languageId),
			this.justiceInquiryRateRepository.existsByLanguage(languageId),
			this.orderRepository.existsByLanguage(languageId),
		]);

		const hasRate = hasBaseRate || hasCertificationRate || hasDynamicRate || hasJusticeInquiryRate;
		if (hasRate || hasOrder) {
			throw new BadRequestError("این زبان در نرخ‌ها یا سفارش‌ها استفاده شده و قابل حذف نیست");
		}

		await this.languageRepository.deleteLanguage(language);
		await this.languageOrderService.removeLanguageOrder(languageId);

		return {
			field: "deleteLanguage",
			success: true,
			data: null,
			message: "زبان با موفقیت حذف شد",
		};
	}
}

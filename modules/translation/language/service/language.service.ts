import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { GetLanguagesFilters } from "../dto/getLanguagesFilters.dto";
import LanguageRepository from "../repositories/language.repository";
import LanguageTransform from "../transform/language.transform";

export default class LanguageService {
	private languageRepository = new LanguageRepository();

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
		return {
			field: "getLanguages",
			success: true,
			message: "لیست زبان ها با موفقیت دریافت شد",
			data: new LanguageTransform().languages(languages),
		};
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
}

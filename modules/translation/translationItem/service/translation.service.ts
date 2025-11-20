import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { GetTranslationItemsFilters } from "../dto/getTranslationItemsFilters.dto";
import TranslationItemRepository from "../repositories/translation.repository";
import TranslationTransform from "../transform/translation.transform";

export default class TranslationService {
	private translationItemRepository = new TranslationItemRepository();

	async createTranslationItem(title: string, documentType: string, description: string) {
		const translationItem = await this.translationItemRepository.findTranslationItemByTitle(title);
		if (translationItem) {
			throw new BadRequestError("یک سند با این عنوان وجود دارد");
		}
		const translationItemByDocumentType = await this.translationItemRepository.findTranslationItemByDocumentType(documentType);
		if (translationItemByDocumentType) {
			throw new BadRequestError("یک سند با این نوع وجود دارد");
		}
		await this.translationItemRepository.createTranslationItem({
			title,
			documentType,
			isActive: true,
			description,
		});
		return {
			field: "createTranslationItem",
			success: true,
			message: "سند با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getTranslationItems(filters: GetTranslationItemsFilters) {
		const translationItems = await this.translationItemRepository.findTranslationItems(filters);
		if (!translationItems) {
			throw new BadRequestError("مشکلی در یافتن سند ها بوجود آمد");
		}
		return {
			field: "getTranslationItems",
			success: true,
			message: "لیست اسناد با موفقیت دریافت شد",
			data: new TranslationTransform().translationItems(translationItems),
		};
	}
	async getTranslationItem(translationItemId: string) {
		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new BadRequestError("مشکلی در یافتن سند بوجود آمد");
		}
		return {
			field: "getTranslationItem",
			success: true,
			message: "سند با موفقیت دریافت شد",
			data: new TranslationTransform().translationItem(translationItem),
		};
	}
	async activateTranslationItem(translationItemId: string) {
		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new BadRequestError("مشکلی در یافتن مدرک بوجود آمد");
		}
		await this.translationItemRepository.updateTranslationItem(translationItem, {
			isActive: true,
		});

		return {
			field: "activateTranslationItem",
			success: true,
			data: null,
			message: "مدرک با موفقیت فعال شد",
		};
	}
	async deactivateTranslationItem(translationItemId: string) {
		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new BadRequestError("مشکلی در یافتن مدرک بوجود آمد");
		}
		await this.translationItemRepository.updateTranslationItem(translationItem, {
			isActive: false,
		});

		return {
			field: "deactivateTranslationItem",
			success: true,
			data: null,
			message: "مدرک با موفقیت غیرفعال شد",
		};
	}
}

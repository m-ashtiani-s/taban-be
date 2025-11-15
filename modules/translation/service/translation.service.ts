import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { GetTranslationItemsFilters } from "../dto/getTranslationItemsFilters.dto";
import TranslationRepository from "../repositories/translation.repository";
import TranslationTransform from "../transform/translation.transform";

export default class TranslationService {
	private translationRepository = new TranslationRepository();

	async createTranslationItem(title: string, documentType: string) {
		const translationItem = await this.translationRepository.findTranslationItemByTitle(title);
		if (translationItem) {
			throw new BadRequestError("یک سند با این عنوان وجود دارد");
		}
		await this.translationRepository.createTranslationItem({
			title,
			documentType,
			isActive: true,
		});
		return {
			field: "createTranslationItem",
			success: true,
			message: "سند با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getTranslationItems(filters: GetTranslationItemsFilters) {
		const translationItems = await this.translationRepository.findTranslationItems(filters);
		if (!translationItems) {
			throw new BadRequestError("مشکلی در یافتن سند ها بوجود آمد");
		}
		return {
			field: "createTranslationItem",
			success: true,
			message: "لیست اسناد با موفقیت دریافت شد",
			data: new TranslationTransform().translationItems(translationItems),
		};
	}
}

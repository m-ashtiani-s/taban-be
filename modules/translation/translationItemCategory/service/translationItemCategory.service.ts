import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import TranslationItemRepository from "../../translationItem/repository/translationItem.repository";
import { GetTranslationItemCategoriesFilters } from "../dto/getTranslationItemCategoriesFilters.dto";
import { TranslationItemCategoryUpdateDto } from "../dto/translationItemCategoryUpdate.dto";
import TranslationItemCategoryRepository from "../repository/translationItemCategory.repository";
import TranslationTransform from "../transform/translationItemCategory.transform";

export default class TranslationService {
	private translationItemCategoryRepository = new TranslationItemCategoryRepository();
	private translationItemRepository = new TranslationItemRepository();

	async createTranslationItemCategory(title: string) {
		const translationItemCategory= await this.translationItemCategoryRepository.findTranslationItemCategoryByTitle(title);
		if (translationItemCategory) {
			throw new BadRequestError("یک دسته‌بندی با این عنوان وجود دارد");
		}
		
		await this.translationItemCategoryRepository.createTranslationItemCategory({
			title
		});
		return {
			field: "createTranslationItemCategory",
			success: true,
			message: "دسته‌بندی با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getTranslationItemCategories(filters: GetTranslationItemCategoriesFilters) {
		const translationItemCategories = await this.translationItemCategoryRepository.findTranslationItemCategories(filters);
		if (!translationItemCategories) {
			throw new BadRequestError("مشکلی در یافتن دسته‌بندی ها بوجود آمد");
		}
		return {
			field: "getTranslationItemCategories",
			success: true,
			message: "لیست دسته‌بندی ها با موفقیت دریافت شد",
			data: new TranslationTransform().translationItemCategories(translationItemCategories),
		};
	}
	async getTranslationItemCategory(translationItemCategoryId: string) {
		const translationItemCategory= await this.translationItemCategoryRepository.findOneTranslationItemCategory(translationItemCategoryId);
		if (!translationItemCategory) {
			throw new BadRequestError("مشکلی در یافتن دسته‌بندی بوجود آمد");
		}
		return {
			field: "getTranslationItemCategory",
			success: true,
			message: "دسته‌بندی با موفقیت دریافت شد",
			data: new TranslationTransform().translationItemCategory(translationItemCategory),
		};
	}
	async updateTranslationItemCategory(translationItemCategoryId: string, updateTtranslationItemCategoryData: TranslationItemCategoryUpdateDto) {
		const translationItemCategory= await this.translationItemCategoryRepository.findByTranslationItemCategoryId(translationItemCategoryId);
		if (!translationItemCategory) {
			throw new BadRequestError("مشکلی در یافتن دسته‌بندی بوجود آمد");
		}
		await this.translationItemCategoryRepository.updateTranslationItemCategory(translationItemCategory, {
			...updateTtranslationItemCategoryData,
		});

		return {
			field: "updateTranslationItemCategory",
			success: true,
			data: null,
			message: "دسته‌بندی با موفقیت به روز شد",
		};
	}
	async deleteTranslationItemCategory(translationItemCategoryId: string) {
		const translationItemCategory = await this.translationItemCategoryRepository.findByTranslationItemCategoryId(translationItemCategoryId);
		if (!translationItemCategory) {
			throw new BadRequestError("مشکلی در یافتن دسته‌بندی بوجود آمد");
		}
		const assignedItemsCount = await this.translationItemRepository.countByCategory(translationItemCategoryId);
		if (assignedItemsCount > 0) {
			throw new BadRequestError("این دسته‌بندی به یک یا چند مدرک اختصاص داده شده و قابل حذف نیست. ابتدا دسته‌بندی این مدارک را تغییر دهید");
		}
		await this.translationItemCategoryRepository.deleteTranslationItemCategory(translationItemCategory);
		return {
			field: "deleteTranslationItemCategory",
			success: true,
			data: null,
			message: "دسته‌بندی با موفقیت حذف شد",
		};
	}
}

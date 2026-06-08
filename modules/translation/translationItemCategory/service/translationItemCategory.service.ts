import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { GetTranslationItemCategoriesFilters } from "../dto/getTranslationItemCategoriesFilters.dto";
import { TtranslationItemCategoryUpdateDto } from "../dto/translationItemCategoryUpdateDto.type";
import TranslationItemCategoryRepository from "../repository/translationItemCategory.repository";
import TranslationTransform from "../transform/translationItemCategory.transform";

export default class TranslationService {
	private translationItemCategoryRepository = new TranslationItemCategoryRepository();

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
	async updateTranslationItemCategory(translationItemCategoryId: string, updateTtranslationItemCategoryData: TtranslationItemCategoryUpdateDto) {
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
}

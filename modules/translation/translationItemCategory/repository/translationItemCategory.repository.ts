import { FilterQuery } from "mongoose";
import { GetTranslationItemCategoriesFilters } from "../dto/getTranslationItemCategoriesFilters.dto";
import TranslationItemCategoryModel, { TranslationItemCategoryDocument } from "../model/translationItemCategory.model";

export default class TranslationItemCategoryRepository {
	async findByTranslationItemCategoryId(translationItemCategoryId: string): Promise<TranslationItemCategoryDocument | null> {
		return TranslationItemCategoryModel.findById(translationItemCategoryId);
	}
	async findOneTranslationItemCategory(translationItemCategoryId: string): Promise<TranslationItemCategoryDocument | null> {
		const searchFilter = {
			...(translationItemCategoryId ? { _id: translationItemCategoryId } : undefined)
		};
		return TranslationItemCategoryModel.findOne(searchFilter);
	}
	async findTranslationItemCategoryByTitle(title: string): Promise<TranslationItemCategoryDocument | null> {
		return TranslationItemCategoryModel.findOne({ title });
	}
	async findTranslationItemCategoryByDocumentType(documentType: string): Promise<TranslationItemCategoryDocument | null> {
		return TranslationItemCategoryModel.findOne({ documentType });
	}
	async findTranslationItemCategories(filters: GetTranslationItemCategoriesFilters): Promise<TranslationItemCategoryDocument[] | null> {
		const query: FilterQuery<TranslationItemCategoryDocument> = {};
		if (filters.term) {
			query.title = { $regex: filters.term, $options: "i" };
		}
		return TranslationItemCategoryModel.find(query);
	}

	async createTranslationItemCategory(data: Partial<TranslationItemCategoryDocument>): Promise<TranslationItemCategoryDocument> {
		const translationItemCategory= new TranslationItemCategoryModel(data);
		return translationItemCategory.save();
	}

	async updateTranslationItemCategory(translationItemCategory: TranslationItemCategoryDocument, data: Partial<TranslationItemCategoryDocument>): Promise<TranslationItemCategoryDocument> {
		Object.assign(translationItemCategory, data);
		return translationItemCategory.save();
	}

	async deleteTranslationItemCategory(translationItemCategory: TranslationItemCategoryDocument): Promise<void> {
		await translationItemCategory.deleteOne();
	}
}

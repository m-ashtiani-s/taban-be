import { FilterQuery } from "mongoose";
import { GetTranslationItemsFilters } from "../dto/getTranslationItemsFilters.dto";
import TranslationItemModel, { TranslationItemDocument } from "../model/translationItem.mode";

export default class TranslationRepository {
	async findByTranslationItemId(translationItemId: string): Promise<TranslationItemDocument | null> {
		return TranslationItemModel.findById(translationItemId);
	}
	async findTranslationItemByTitle(title: string): Promise<TranslationItemDocument | null> {
		return TranslationItemModel.findOne({ title });
	}
	async findTranslationItems(filters: GetTranslationItemsFilters): Promise<TranslationItemDocument[] | null> {
		const query: FilterQuery<TranslationItemDocument> = {};
		if (typeof filters.isActive === "boolean") {
			query.isActive = filters.isActive;
		}
		if (filters.term) {
			query.title = { $regex: filters.term, $options: "i" };
		}
		return TranslationItemModel.find(query);
	}

	async createTranslationItem(data: Partial<TranslationItemDocument>): Promise<TranslationItemDocument> {
		const translationItem = new TranslationItemModel(data);
		return translationItem.save();
	}

	async updateTranslationItem(translationItem: TranslationItemDocument, data: Partial<TranslationItemDocument>): Promise<TranslationItemDocument> {
		Object.assign(translationItem, data);
		return translationItem.save();
	}

	async deleteTranslationItem(translationItem: TranslationItemDocument): Promise<void> {
		await translationItem.deleteOne();
	}
}

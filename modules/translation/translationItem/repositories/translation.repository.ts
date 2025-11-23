import { FilterQuery } from "mongoose";
import { GetTranslationItemsFilters } from "../dto/getTranslationItemsFilters.dto";
import TranslationItemModel, { TranslationItemDocument } from "../model/translationItem.mode";

export default class TranslationItemRepository {
	async findByTranslationItemId(translationItemId: string, populateFields?: string[]): Promise<TranslationItemDocument | null> {
		let query = TranslationItemModel.findById(translationItemId);
		if (populateFields?.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async findOneTranslationItem(translationItemId: string, isActive?: boolean, populateFields?: string[]): Promise<TranslationItemDocument | null> {
		const searchFilter = {
			...(translationItemId ? { _id: translationItemId } : undefined),
			...(typeof isActive === "boolean" ? { isActive } : undefined),
		};

		let query = TranslationItemModel.findOne(searchFilter);
		if (populateFields?.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async findTranslationItemByTitle(title: string, populateFields?: string[]): Promise<TranslationItemDocument | null> {
		let query = TranslationItemModel.findOne({ title });
		if (populateFields?.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async findTranslationItemByDocumentType(documentType: string, populateFields?: string[]): Promise<TranslationItemDocument | null> {
		let query = TranslationItemModel.findOne({ documentType });
		if (populateFields?.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async findTranslationItems(filters: GetTranslationItemsFilters, populateFields?: string[]): Promise<TranslationItemDocument[] | null> {
		const queryObj: FilterQuery<TranslationItemDocument> = {};

		if (typeof filters.isActive === "boolean") {
			queryObj.isActive = filters.isActive;
		}

		if (filters.term) {
			queryObj.title = { $regex: filters.term, $options: "i" };
		}

		let query = TranslationItemModel.find(queryObj);

		if (populateFields?.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}

		return query.exec();
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

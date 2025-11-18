import { FilterQuery } from "mongoose";
import LanguageModel, { LanguageDocument } from "../model/translationItem.mode";
import { GetLanguagesFilters } from "../dto/getLanguagesFilters.dto";

export default class LanguageRepository {
	async findByLanguageId(languageId: string): Promise<LanguageDocument | null> {
		return LanguageModel.findById(languageId);
	}
	async findLanguageByTitle(languageName: string): Promise<LanguageDocument | null> {
		return LanguageModel.findOne({ languageName });
	}
	async findLanguageByLanguageCode(languageCode: string): Promise<LanguageDocument | null> {
		return LanguageModel.findOne({ languageCode });
	}
	async findLanguages(filters: GetLanguagesFilters): Promise<LanguageDocument[] | null> {
		const query: FilterQuery<LanguageDocument> = {};
		if (filters.term) {
			query.languageName = { $regex: filters.term, $options: "i" };
		}
		return LanguageModel.find(query);
	}

	async createLanguage(data: Partial<LanguageDocument>): Promise<LanguageDocument> {
		const language = new LanguageModel(data);
		return language.save();
	}

	async updateLanguage(language: LanguageDocument, data: Partial<LanguageDocument>): Promise<LanguageDocument> {
		Object.assign(language, data);
		return language.save();
	}

	async deleteLanguage(language: LanguageDocument): Promise<void> {
		await language.deleteOne();
	}
}

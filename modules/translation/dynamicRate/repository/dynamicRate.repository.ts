import mongoose, { FilterQuery } from "mongoose";
import DynamicRateModel, { DynamicRateDocument } from "../model/dynamicRate.model";
import { GetDynamicRatesFilters } from "../dto/dynamicRateFilters.dto";

export default class DynamicRateRepository {
	async findByDynamicRateId(dynamicRateId: string, populateFields?: string[], session?: mongoose.ClientSession): Promise<DynamicRateDocument | null> {
		let query = DynamicRateModel.findById(dynamicRateId);

		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}

		if (session) {
			query = query.session(session);
		}

		return query.exec();
	}
	async findDynamicRates(filter: GetDynamicRatesFilters, populateFields?: string[]): Promise<DynamicRateDocument[]> {
		const searchFilter = {
			...(filter?.translationItemId ? { translationItem: filter?.translationItemId } : undefined),
			...(filter?.languageId ? { language: filter?.languageId } : undefined),
		};
		let query = DynamicRateModel.find(searchFilter);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}
	async createDynamicRate(data: Partial<DynamicRateDocument>): Promise<DynamicRateDocument> {
		const dynamicRate = new DynamicRateModel(data);
		return dynamicRate.save();
	}

	async updateDynamicRate(dynamicRate: DynamicRateDocument, data: Partial<DynamicRateDocument>): Promise<DynamicRateDocument> {
		Object.assign(dynamicRate, data);
		return dynamicRate.save();
	}

	async deleteDynamicRate(dynamicRate: DynamicRateDocument): Promise<void> {
		await dynamicRate.deleteOne();
	}

	async existsByTranslationItem(translationItemId: string): Promise<boolean> {
		const found = await DynamicRateModel.exists({ translationItem: translationItemId }).exec();
		return !!found;
	}

	async existsByLanguage(languageId: string): Promise<boolean> {
		const found = await DynamicRateModel.exists({ language: languageId }).exec();
		return !!found;
	}
}

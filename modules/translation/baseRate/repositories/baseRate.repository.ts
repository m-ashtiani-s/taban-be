import { FilterQuery } from "mongoose";
import BaseRateModel, { BaseRateDocument } from "../model/baseRate.mode";
import { GetBaseRatesFilters } from "../dto/baseRateFilters.dto";

export default class BaseRateRepository {
	async findByBaseRateId(baseRateId: string, populateFields?: string[]): Promise<BaseRateDocument | null> {
		let query = BaseRateModel.findById(baseRateId);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}
	async findBaseRates(filter: GetBaseRatesFilters, populateFields?: string[]): Promise<BaseRateDocument[]> {
		const searchFilter = {
			...(filter?.translationItemId ? { translationItem: filter?.translationItemId } : undefined),
			...(filter?.languageId ? { language: filter?.languageId } : undefined),
		};
		let query = BaseRateModel.find(searchFilter);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async findOneBaseRate(filter: GetBaseRatesFilters, populateFields?: string[]): Promise<BaseRateDocument | null> {
		const searchFilter = {
			...(filter?.translationItemId ? { translationItem: filter?.translationItemId } : undefined),
			...(filter?.languageId ? { language: filter?.languageId } : undefined),
		};
		let query = BaseRateModel.findOne(searchFilter);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}
	async createBaseRate(data: Partial<BaseRateDocument>): Promise<BaseRateDocument> {
		const baseRate = new BaseRateModel(data);
		return baseRate.save();
	}

	async updateBaseRate(baseRate: BaseRateDocument, data: Partial<BaseRateDocument>): Promise<BaseRateDocument> {
		Object.assign(baseRate, data);
		return baseRate.save();
	}

	async deleteBaseRate(baseRate: BaseRateDocument): Promise<void> {
		await baseRate.deleteOne();
	}
}

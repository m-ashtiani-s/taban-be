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
		let query = BaseRateModel.find({translationItem:filter?.translationItemId,language:filter?.languageId});
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async findOneBaseRate(filter: GetBaseRatesFilters, populateFields?: string[]): Promise<BaseRateDocument | null> {
		let query = BaseRateModel.findOne({translationItem:filter?.translationItemId,language:filter?.languageId});
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

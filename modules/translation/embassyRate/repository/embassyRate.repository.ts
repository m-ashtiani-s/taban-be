import mongoose, { FilterQuery } from "mongoose";
import EmbassyRateModel, { EmbassyRateDocument } from "../model/embassyRate.model";
import { GetEmbassyRatesFilters } from "../dto/embassyRateFilters.dto";

export default class EmbassyRateRepository {
	async findByEmbassyRateId(
		embassyRateId: string,
		populateFields?: string[],
		session?: mongoose.ClientSession
	): Promise<EmbassyRateDocument | null> {
		let query = EmbassyRateModel.findById(embassyRateId);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		if (session) {
			query = query.session(session);
		}
		return query.exec();
	}
	async findEmbassyRates(filter: GetEmbassyRatesFilters, populateFields?: string[]): Promise<EmbassyRateDocument[]> {
		const searchFilter = {
			...(filter?.translationItemId ? { translationItem: filter?.translationItemId } : undefined)
		};
		let query = EmbassyRateModel.find(searchFilter);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}
	async createEmbassyRate(data: Partial<EmbassyRateDocument>): Promise<EmbassyRateDocument> {
		const embassyRate = new EmbassyRateModel(data);
		return embassyRate.save();
	}

	async updateEmbassyRate(
		embassyRate: EmbassyRateDocument,
		data: Partial<EmbassyRateDocument>
	): Promise<EmbassyRateDocument> {
		Object.assign(embassyRate, data);
		return embassyRate.save();
	}

	async deleteEmbassyRate(embassyRate: EmbassyRateDocument): Promise<void> {
		await embassyRate.deleteOne();
	}

	async existsByTranslationItem(translationItemId: string): Promise<boolean> {
		const found = await EmbassyRateModel.exists({ translationItem: translationItemId }).exec();
		return !!found;
	}

	async existsByEmbassy(embassyId: string): Promise<boolean> {
		const found = await EmbassyRateModel.exists({ embassy: embassyId }).exec();
		return !!found;
	}
}

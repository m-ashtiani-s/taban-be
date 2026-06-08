import mongoose, { FilterQuery } from "mongoose";
import JusticeInquiryRateModel, { JusticeInquiryRateDocument } from "../model/justiceInquiryRate.model";
import { GetJusticeInquiryRatesFilters } from "../dto/justiceInquiryRateFilters.dto";

export default class JusticeInquiryRateRepository {
	async findByJusticeInquiryRateId(
		justiceInquiryRateId: string,
		populateFields?: string[],
		session?: mongoose.ClientSession
	): Promise<JusticeInquiryRateDocument | null> {
		let query = JusticeInquiryRateModel.findById(justiceInquiryRateId);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		if (session) {
			query = query.session(session);
		}
		return query.exec();
	}
	async findJusticeInquiryRates(filter: GetJusticeInquiryRatesFilters, populateFields?: string[]): Promise<JusticeInquiryRateDocument[]> {
		const searchFilter = {
			...(filter?.translationItemId ? { translationItem: filter?.translationItemId } : undefined),
			...(filter?.languageId ? { language: filter?.languageId } : undefined),
		};
		let query = JusticeInquiryRateModel.find(searchFilter);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}
	async createJusticeInquiryRate(data: Partial<JusticeInquiryRateDocument>): Promise<JusticeInquiryRateDocument> {
		const justiceInquiryRate = new JusticeInquiryRateModel(data);
		return justiceInquiryRate.save();
	}

	async updateJusticeInquiryRate(
		justiceInquiryRate: JusticeInquiryRateDocument,
		data: Partial<JusticeInquiryRateDocument>
	): Promise<JusticeInquiryRateDocument> {
		Object.assign(justiceInquiryRate, data);
		return justiceInquiryRate.save();
	}

	async deleteJusticeInquiryRate(justiceInquiryRate: JusticeInquiryRateDocument): Promise<void> {
		await justiceInquiryRate.deleteOne();
	}
}

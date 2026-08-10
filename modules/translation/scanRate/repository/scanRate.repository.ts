import mongoose from "mongoose";
import ScanRateModel, { ScanRateDocument } from "../model/scanRate.model";
import { GetScanRatesFilters } from "../dto/scanRateFilters.dto";

export default class ScanRateRepository {
	async findByScanRateId(
		scanRateId: string,
		populateFields?: string[],
		session?: mongoose.ClientSession
	): Promise<ScanRateDocument | null> {
		let query = ScanRateModel.findById(scanRateId);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		if (session) {
			query = query.session(session);
		}
		return query.exec();
	}

	async findScanRates(filter: GetScanRatesFilters, populateFields?: string[]): Promise<ScanRateDocument[]> {
		const searchFilter = {
			...(filter?.translationItemId ? { translationItem: filter.translationItemId } : undefined),
		};
		let query = ScanRateModel.find(searchFilter);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async createScanRate(data: Partial<ScanRateDocument>): Promise<ScanRateDocument> {
		const scanRate = new ScanRateModel(data);
		return scanRate.save();
	}

	async updateScanRate(scanRate: ScanRateDocument, data: Partial<ScanRateDocument>): Promise<ScanRateDocument> {
		Object.assign(scanRate, data);
		return scanRate.save();
	}

	async deleteScanRate(scanRate: ScanRateDocument): Promise<void> {
		await scanRate.deleteOne();
	}

	async existsByTranslationItem(translationItemId: string): Promise<boolean> {
		const found = await ScanRateModel.exists({ translationItem: translationItemId }).exec();
		return !!found;
	}
}

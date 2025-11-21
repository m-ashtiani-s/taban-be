import { FilterQuery } from "mongoose";
import CertificationRateModel, { CertificationRateDocument } from "../model/certificationRate.mode";
import { GetCertificationRatesFilters } from "../dto/certificationRateFilters.dto";

export default class CertificationRateRepository {
	async findByCertificationRateId(certificationRateId: string, populateFields?: string[]): Promise<CertificationRateDocument | null> {
		let query = CertificationRateModel.findById(certificationRateId);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}
	async findCertificationRates(filter: GetCertificationRatesFilters, populateFields?: string[]): Promise<CertificationRateDocument[]> {
		const searchFilter = {
			...(filter?.translationItemId ? { translationItem: filter?.translationItemId } : undefined),
			...(filter?.languageId ? { language: filter?.languageId } : undefined),
		};
		let query = CertificationRateModel.find(searchFilter);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}
	async createCertificationRate(data: Partial<CertificationRateDocument>): Promise<CertificationRateDocument> {
		const certificationRate = new CertificationRateModel(data);
		return certificationRate.save();
	}

	async updateCertificationRate(certificationRate: CertificationRateDocument, data: Partial<CertificationRateDocument>): Promise<CertificationRateDocument> {
		Object.assign(certificationRate, data);
		return certificationRate.save();
	}

	async deleteCertificationRate(certificationRate: CertificationRateDocument): Promise<void> {
		await certificationRate.deleteOne();
	}
}

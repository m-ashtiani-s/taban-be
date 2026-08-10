import mongoose, { FilterQuery } from "mongoose";
import CertificationRateModel, { CertificationRateDocument } from "../model/certificationRate.model";
import { GetCertificationRatesFilters } from "../dto/certificationRateFilters.dto";

export default class CertificationRateRepository {
	async findByCertificationRateId(certificationRateId: string, populateFields?: string[], session?: mongoose.ClientSession): Promise<CertificationRateDocument | null> {
		let query = CertificationRateModel.findById(certificationRateId);

		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}

		if (session) {
			query = query.session(session);
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

	async existsByTranslationItem(translationItemId: string): Promise<boolean> {
		const found = await CertificationRateModel.exists({ translationItem: translationItemId }).exec();
		return !!found;
	}

	async existsByLanguage(languageId: string): Promise<boolean> {
		const found = await CertificationRateModel.exists({ language: languageId }).exec();
		return !!found;
	}
}

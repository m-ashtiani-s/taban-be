import { FilterQuery } from "mongoose";
import { GetEmbassiesFilters } from "../dto/getEmbassyFilters.dto";
import EmbassyModel, { EmbassyDocument } from "../model/embassy.mode";

export default class EmbassyRepository {
	async findByEmbassyId(embassyId: string, populateFields?: string[]): Promise<EmbassyDocument | null> {
		let query = EmbassyModel.findById(embassyId);
		if (populateFields?.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async findOneEmbassy(embassyId: string, isActive?: boolean, populateFields?: string[]): Promise<EmbassyDocument | null> {
		const searchFilter = {
			...(embassyId ? { _id: embassyId } : undefined),
			...(typeof isActive === "boolean" ? { isActive } : undefined),
		};

		let query = EmbassyModel.findOne(searchFilter);
		if (populateFields?.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async findEmbassyByTitle(title: string, populateFields?: string[]): Promise<EmbassyDocument | null> {
		let query = EmbassyModel.findOne({ title });
		if (populateFields?.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return query.exec();
	}

	async findEmbassies(filters: GetEmbassiesFilters, populateFields?: string[]): Promise<EmbassyDocument[] | null> {
		const queryObj: FilterQuery<EmbassyDocument> = {};

		if (typeof filters.isActive === "boolean") {
			queryObj.isActive = filters.isActive;
		}

		if (filters.term) {
			queryObj.title = { $regex: filters.term, $options: "i" };
		}

		let query = EmbassyModel.find(queryObj);

		if (populateFields?.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}

		return query.exec();
	}

	async createEmbassy(data: Partial<EmbassyDocument>): Promise<EmbassyDocument> {
		const embassy = new EmbassyModel(data);
		return embassy.save();
	}

	async updateEmbassy(embassy: EmbassyDocument, data: Partial<EmbassyDocument>): Promise<EmbassyDocument> {
		Object.assign(embassy, data);
		return embassy.save();
	}

	async deleteEmbassy(embassy: EmbassyDocument): Promise<void> {
		await embassy.deleteOne();
	}
}

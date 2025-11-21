import { FilterQuery } from "mongoose";
import JusticeInquiryModel, { JusticeInquiryDocument } from "../model/justiceInquiry.mode";
import { GetJusticeInquirysFilters } from "../dto/getJusticeInquiryFilters.dto";

export default class JusticeInquiryRepository {
	async findByJusticeInquiryId(justiceInquiryId: string): Promise<JusticeInquiryDocument | null> {
		return JusticeInquiryModel.findById(justiceInquiryId);
	}
	async findOneJusticeInquiry(justiceInquiryId: string, isActive?: boolean): Promise<JusticeInquiryDocument | null> {
		const searchFilter = {
			...(justiceInquiryId ? { _id: justiceInquiryId } : undefined),
			...(isActive === true || isActive === false ? { isActive } : undefined),
		};
		return JusticeInquiryModel.findOne(searchFilter);
	}
	async findJusticeInquiryByTitle(justiceInquiryName: string): Promise<JusticeInquiryDocument | null> {
		return JusticeInquiryModel.findOne({ justiceInquiryName });
	}
	async findJusticeInquiryByJusticeInquiryCode(justiceInquiryCode: string): Promise<JusticeInquiryDocument | null> {
		return JusticeInquiryModel.findOne({ justiceInquiryCode });
	}
	async findJusticeInquirys(filters: GetJusticeInquirysFilters): Promise<JusticeInquiryDocument[] | null> {
		const query: FilterQuery<JusticeInquiryDocument> = {
			...(filters?.isActive === true || filters?.isActive === false ? { isActive: filters?.isActive } : undefined),
		};
		if (filters.term) {
			query.justiceInquiryName = { $regex: filters.term, $options: "i" };
		}
		return JusticeInquiryModel.find(query);
	}

	async createJusticeInquiry(data: Partial<JusticeInquiryDocument>): Promise<JusticeInquiryDocument> {
		const justiceInquiry = new JusticeInquiryModel(data);
		return justiceInquiry.save();
	}

	async updateJusticeInquiry(justiceInquiry: JusticeInquiryDocument, data: Partial<JusticeInquiryDocument>): Promise<JusticeInquiryDocument> {
		Object.assign(justiceInquiry, data);
		return justiceInquiry.save();
	}

	async deleteJusticeInquiry(justiceInquiry: JusticeInquiryDocument): Promise<void> {
		await justiceInquiry.deleteOne();
	}
}

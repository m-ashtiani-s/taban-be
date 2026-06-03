import EnterpriseCustomerModel, { EnterpriseCustomerDocument } from "../model/enterpriseCustomer.model";
import { CreateEnterpriseCustomerDto } from "../dto/enterpriseCustomer.dto";

export default class EnterpriseCustomerRepository {
	async findByUserId(userId: string): Promise<EnterpriseCustomerDocument | null> {
		return EnterpriseCustomerModel.findOne({ user: userId }).exec();
	}

	async create(userId: string, data: CreateEnterpriseCustomerDto): Promise<EnterpriseCustomerDocument> {
		const enterpriseCustomer = new EnterpriseCustomerModel({ ...data, user: userId });
		return enterpriseCustomer.save();
	}
}

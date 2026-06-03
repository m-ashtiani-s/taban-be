import { PaginateResult } from "mongoose";
import userModel, { UserDocument } from "../model/user.model";
import { PaginationInput, PaginationResult } from "../../../shared/utils/pagination.util";
import { AdminUserFilters } from "../dto/adminUser.dto";
import { generateReferralCode } from "../../../shared/utils/generateReferralCode.util";

export default class UserRepository {
	async findByUserId(id: string, populateFields?: string[]): Promise<UserDocument | null> {
		let query = userModel.findById(id);
		if (populateFields && populateFields.length) {
			populateFields.forEach((field) => (query = query.populate(field)));
		}
		return await query.exec();
	}

	async findPaginated(filters: AdminUserFilters, pagination: PaginationInput): Promise<PaginationResult<UserDocument>> {
		const query: any = {};
		if (filters.term) {
			query.$or = [
				{ firstName: { $regex: filters.term, $options: "i" } },
				{ lastName: { $regex: filters.term, $options: "i" } },
				{ username: { $regex: filters.term, $options: "i" } },
				{ phoneNumber: { $regex: filters.term, $options: "i" } },
				{ nationalId: { $regex: filters.term, $options: "i" } },
			];
		}
		if (filters.customerType) query.customerType = filters.customerType;
		if (filters.userType) query.userType = filters.userType;
		if (filters.isActive !== undefined) query.isActive = filters.isActive;

		const res: PaginateResult<UserDocument> = await userModel.paginate(query, {
			page: pagination.page,
			limit: pagination.limit,
			sort: pagination.sort,
			populate: "requiredLanguages",
		});
		return {
			page: res.page ?? 1,
			pageSize: res.limit,
			totalPages: res.totalPages,
			totalElements: res.totalDocs,
			elements: res.docs,
		};
	}

	async updateUserById(userId: string, data: Partial<UserDocument>): Promise<UserDocument | null> {
		return await userModel
			.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true })
			.populate("requiredLanguages")
			.exec();
	}

	async setActiveStatus(userId: string, isActive: boolean): Promise<UserDocument | null> {
		return await userModel
			.findByIdAndUpdate(userId, { $set: { isActive } }, { new: true })
			.exec();
	}

	async findByUsername(username: string): Promise<UserDocument | null> {
		return await userModel.findOne({ username });
	}

	async findByOwnReferralCode(code: string): Promise<UserDocument | null> {
		return await userModel.findOne({ ownReferralCode: code });
	}

	/** تولید یک کد معرفِ یکتا (تکرار تا زمانی که کد تکراری نباشد) */
	async generateUniqueReferralCode(length: number = 8): Promise<string> {
		let candidate = "";
		let exists = true;
		while (exists) {
			candidate = generateReferralCode(length);
			const found = await this.findByOwnReferralCode(candidate);
			exists = !!found;
		}
		return candidate;
	}

	async createUser(data: Partial<UserDocument>): Promise<UserDocument> {
		const user = new userModel(data);
		return user.save();
	}
	async deleteOtp(user: UserDocument): Promise<void> {
		await user.deleteOne();
	}
	async updateUser(user: UserDocument, data: Partial<UserDocument>): Promise<UserDocument> {
		Object.assign(user, data);
		return user.save();
	}
}

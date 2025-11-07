import userModel, { UserDocument } from "../model/user.model";

export default class UserRepository {
	async findByUserId(id: string): Promise<UserDocument | null> {
		return await userModel.findById(id);
	}

	async findByUsername(username: string): Promise<UserDocument | null> {
		return await userModel.findOne({ username });
	}

	async createUser(data: Partial<UserDocument>): Promise<UserDocument> {
		const user = new userModel(data);
		return user.save();
	}

	async updateOtp(user: UserDocument, data: Partial<UserDocument>): Promise<UserDocument> {
		Object.assign(user, data);
		return user.save();
	}

	async deleteOtp(user: UserDocument): Promise<void> {
		await user.deleteOne();
	}
}

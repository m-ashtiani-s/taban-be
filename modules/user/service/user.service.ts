import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { IncompleteItem, ProfileCompletionCheckDto } from "../dto/profileCompletionCheck.dto";
import { UpdateUserRequestDto } from "../dto/updateUserRequest.dto";
import { UserDocument } from "../model/user.model";
import UserRepository from "../repository/user.repository";

export default class UserService {
	private userRepository = new UserRepository();

	async profileCompletionStatus(userId: string) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) {
			throw new BadRequestError("مشکلی در یافتن کاربری شما بوجود آمد");
		}
		const userItemsForComplete: IncompleteItem[] = [
			{ itemKey: "nationalId", itemName: "کد ملی" },
			{ itemKey: "username", itemName: "نام کاربری" },
			{ itemKey: "firstName", itemName: "نام" },
			{ itemKey: "lastName", itemName: "نام خانوادگی" },
			{ itemKey: "birthDate", itemName: "تاریخ تولد" },
			{ itemKey: "email", itemName: "ایمیل" },
			{ itemKey: "gender", itemName: "جنسیت" },
			{ itemKey: "state", itemName: "استان" },
			{ itemKey: "city", itemName: "شهر" },
			{ itemKey: "referralSource", itemName: "راه آشنایی با ما" },
		];
		const incompleteItems: IncompleteItem[] = [];
		userItemsForComplete?.map((it) => {
			if (!user[it?.itemKey as keyof UserDocument]) {
				incompleteItems?.push(it);
			}
		});
		const completionPercent = ((userItemsForComplete?.length - incompleteItems?.length) / userItemsForComplete?.length) * 100;
		const isCompleted = incompleteItems?.length === 0;
		const profileCompletionCheck: ProfileCompletionCheckDto = {
			isCompleted,
			completionPercent,
			incompleteItems,
		};
		return {
			field: "profileCompletionStatus",
			success: true,
			data: profileCompletionCheck,
			message: isCompleted ? "پروفایل کاربری کامل است" : "پروفایل کاربری کامل نیست",
		};
	}
	async updateUser(userId: string, updateUserData: UpdateUserRequestDto) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) {
			throw new BadRequestError("مشکلی در یافتن کاربری شما بوجود آمد");
		}
		await this.userRepository.updateUser(user, {
			...updateUserData,
		});

		return {
			field: "updateUser",
			success: true,
			data: null,
			message: "پروفایل با موفقیت به روز شد",
		};
	}
}

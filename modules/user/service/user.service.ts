import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { IncompleteItem, ProfileCompletionCheckDto } from "../dto/profileCompletionCheck.dto";
import { UpdateUserRequestDto } from "../dto/updateUserRequest.dto";
import { UserDocument } from "../model/user.model";
import UserRepository from "../repository/user.repository";
import UserTransform from "../transform/user.transform";

export default class UserService {
	private userRepository = new UserRepository();

	async profileCompletionStatus(userId: string) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) {
			throw new BadRequestError("مشکلی در یافتن کاربری شما بوجود آمد");
		}
		// تصویر پروفایل و شماره تماس در محاسبه‌ی درصد تکمیل پروفایل لحاظ نمی‌شوند
		const userItemsForComplete: IncompleteItem[] = [
			{ itemKey: "firstName", itemName: "نام" },
			{ itemKey: "lastName", itemName: "نام خانوادگی" },
			{ itemKey: "nationalId", itemName: "کد ملی" },
			{ itemKey: "userType", itemName: "نوع کاربری" },
			{ itemKey: "requiredLanguages", itemName: "زبان‌های مورد نیاز" },
			{ itemKey: "specialtyField", itemName: "حوزه تخصصی" },
			{ itemKey: "referralSource", itemName: "نحوه آشنایی با ما" },
		];
		const incompleteItems: IncompleteItem[] = [];
		userItemsForComplete?.map((it) => {
			const value = user[it?.itemKey as keyof UserDocument];
			const isEmpty =
				value === undefined ||
				value === null ||
				value === "" ||
				(Array.isArray(value) && value.length === 0);
			if (isEmpty) {
				incompleteItems?.push(it);
			}
		});
		const completionPercent =
			((userItemsForComplete?.length - incompleteItems?.length) / userItemsForComplete?.length) * 100;
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

		const updateData: Partial<UserDocument> = {};
		(Object.keys(updateUserData) as (keyof UpdateUserRequestDto)[]).forEach((key) => {
			// کد معرف جداگانه و با قانون تغییرناپذیری مدیریت می‌شود
			if (key === "referralCode") return;
			const value = updateUserData[key];
			if (value !== undefined) {
				(updateData as any)[key] = value;
			}
		});

		// کد معرف فقط یک‌بار قابل ثبت است؛ پس از ثبت، تغییرپذیر نیست.
		const incomingReferralCode = updateUserData.referralCode?.trim().toUpperCase() || "";
		if (incomingReferralCode && !user.referralCode) {
			// کد معرف باید متعلق به یک کاربر موجود باشد و کاربر نمی‌تواند کد خودش را وارد کند
			if (user.ownReferralCode && incomingReferralCode === user.ownReferralCode) {
				throw new BadRequestError("نمی‌توانید کد معرف خودتان را وارد کنید");
			}
			const referrer = await this.userRepository.findByOwnReferralCode(incomingReferralCode);
			if (!referrer) {
				throw new BadRequestError("کد معرف وارد شده معتبر نیست");
			}
			updateData.referralCode = incomingReferralCode;
		}

		// تضمین وجود کد معرف برای کاربرانی که قبلاً (پیش از این قابلیت) ساخته شده‌اند
		if (!user.ownReferralCode) {
			updateData.ownReferralCode = await this.userRepository.generateUniqueReferralCode();
		}

		await this.userRepository.updateUser(user, updateData);

		return {
			field: "updateUser",
			success: true,
			data: null,
			message: "پروفایل با موفقیت به‌روز شد",
		};
	}

	async getUser(userId: string) {
		const user = await this.userRepository.findByUserId(userId, ["requiredLanguages"]);
		if (!user) {
			throw new BadRequestError("مشکلی در یافتن کاربری شما بوجود آمد");
		}
		return {
			field: "getUser",
			success: true,
			data: new UserTransform().user(user),
			message: "پروفایل با موفقیت دریافت شد",
		};
	}
}

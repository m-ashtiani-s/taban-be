import { UserDto } from "../dto/user.dto";
import { UserDocument } from "../model/user.model";
import { LanguageDocument } from "../../translation/language/model/language.model";
import { LanguageDto } from "../../translation/language/dto/language.dto";
import LanguageTransform from "../../translation/language/transform/language.transform";
import { PaginationResult } from "../../../shared/utils/pagination.util";

export default class UserTransform {
	private languageTransform = new LanguageTransform();

	/**
	 * زبان‌های مورد نیاز کاربر را به DTO کامل زبان تبدیل می‌کند.
	 * در صورتی که فیلد populate شده باشد، خود آبجکت زبان برگردانده می‌شود؛
	 * در غیر این صورت (آیدی خام) آن مورد نادیده گرفته می‌شود.
	 */
	private requiredLanguages(requiredLanguages?: (string | LanguageDocument)[]): LanguageDto[] {
		if (!requiredLanguages?.length) return [];
		return requiredLanguages
			.filter((language): language is LanguageDocument => !!language && typeof language === "object")
			.map((language) => this.languageTransform.language(language));
	}

	users(docs: UserDocument[]): UserDto[] {
		return docs.map((u) => this.user(u));
	}

	paginatedUsers(paginated: PaginationResult<UserDocument>) {
		return {
			...paginated,
			elements: paginated.elements.map((u) => this.user(u)),
		};
	}

	user(user: UserDocument): UserDto {
		return {
			userId: user?._id as string,
			username: user?.username ?? "",
			role: user?.role ?? "",
			profilePic: user?.profilePic ?? "",
			isActive: user?.isActive ?? false,
			customerType: user?.customerType ?? "NORMAL",
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			fullName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
			nationalId: user?.nationalId ?? "",
			phoneNumber: user?.phoneNumber ?? "",
			userType: user?.userType ?? null,
			requiredLanguages: this.requiredLanguages(user?.requiredLanguages),
			specialtyField: user?.specialtyField ?? "",
			referralSource: user?.referralSource ?? "",
			referralCode: user?.referralCode ?? "",
			ownReferralCode: user?.ownReferralCode ?? "",
		};
	}
}

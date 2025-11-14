import { generateCityName } from "../../../shared/utils/generateCityName.util";
import { generateProvinceName } from "../../../shared/utils/generateProvinceName.util";
import { UserDto } from "../dto/user.dto";
import { UserDocument } from "../model/user.model";

export default class UserTransform {
	user(user: UserDocument): UserDto {
		return {
			userId: user?._id as string,
			username: user?.username ?? "",
			role: user?.role ?? "",
			profilePic: user?.profilePic ?? "",
			isActive: user?.isActive ?? "",
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			fullName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
			birthDate: user?.birthDate ?? "",
			email: user?.email ?? "",
			gender: user?.gender ?? "",
			provinceId: user?.province ?? null,
			provinceName: generateProvinceName(user?.province!) ?? "",
			cityId: user?.city ?? null,
			cityName: generateCityName(user?.city!) ?? "",
			referralSource: user?.referralSource ?? "",
		};
	}
}

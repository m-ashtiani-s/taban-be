import Config from "../../../config/config";
import { UserDocument } from "../../user/model/user.model";
import { LoginDto } from "../dto/login.dto";
import jwt from "jsonwebtoken";

export default class AuthTransform {
	login(user: UserDocument) {
		const now = new Date();
		const expireTime = new Date(now.getTime() + 24 * 60 * 60000);
		let token = jwt.sign({ user_id: user._id, username: user.username }, Config.secret, {
			expiresIn: "24h",
		});
		const loginData: LoginDto = {
			userId: user?._id as string,
			username: user?.username,
			acceeToken: token,
			expireTime: expireTime?.toString(),
			role: user?.role,
		};

		return loginData;
	}
}

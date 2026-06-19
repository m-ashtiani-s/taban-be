import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import Config from "../../config/config";
import UserRepository from "../../modules/user/repository/user.repository";

const userRepository = new UserRepository();

/**
 * احراز هویت اختیاری: اگر توکن معتبری ارسال شده باشد، req.user را پر می‌کند؛ در غیر این صورت
 * بدون خطا ادامه می‌دهد (کاربر مهمان). برای endpointهایی مثل محاسبه‌ی نرخ که هم برای مهمان و هم
 * کاربر لاگین‌شده در دسترس‌اند و رفتارشان (مثلاً تخفیف سطح) به ورود کاربر بستگی دارد.
 */
const OptionalAuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const baseToken = req.headers["authorization"];
		const token = baseToken?.replace("Bearer ", "")?.replace("bearer ", "");
		if (token && typeof token === "string") {
			const decoded = jwt.verify(token, Config.secret) as jwt.JwtPayload;
			if (decoded?.user_id) {
				const user = await userRepository.findByUserId(decoded.user_id);
				if (user) req.user = user;
			}
		}
	} catch {
		// توکن نامعتبر را نادیده می‌گیریم و کاربر به‌عنوان مهمان ادامه می‌دهد
	}
	next();
};

export default OptionalAuthMiddleware;

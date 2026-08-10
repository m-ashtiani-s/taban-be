import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../modules/user/model/user.model";

/**
 * گاردِ نقش‌محور برای مسیرهایی که فراتر از AdminAuthMiddleware (که ADMIN و OPERATOR را با هم
 * می‌پذیرد) باید به نقش‌های مشخصی محدود شوند. مثلاً تغییر رمز عبور کاربران فعلاً فقط برای ADMIN.
 */
const requireRoles =
	(...roles: UserRole[]) =>
	(req: Request, res: Response, next: NextFunction) => {
		if (req?.user?.role && roles.includes(req.user.role as UserRole)) {
			return next();
		}
		return res.status(403).json({
			field: "authentication",
			success: false,
			data: null,
			message: "شما دسترسی به این عملیات ندارید",
		});
	};

export default requireRoles;

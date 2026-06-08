import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../modules/user/model/user.model";

const AdminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (req?.user?.role === UserRole.ADMIN) {
		return next();
	} else {
		return res.status(403).json({
			field: "authentication",
			success: false,
			data: null,
			message: "شما دسترسی به این مسیر ندارید",
		});
	}
};

export default AdminAuthMiddleware;

import { NextFunction, Request, Response } from "express";

const EnterpriseAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (req?.user?.customerType === "ENTERPRISE") {
		return next();
	} else {
		return res.status(403).json({
			field: "authentication",
			success: false,
			data: null,
			message: "این بخش تنها برای مشتریان سازمانی در دسترس است",
		});
	}
};

export default EnterpriseAuthMiddleware;

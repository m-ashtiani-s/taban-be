import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import AdminUrgencyService from "../service/urgency.admin.service";

const adminUrgencyService = new AdminUrgencyService();

export default class AdminUrgencyController extends ControllerBase {
	getUrgency = async (req: Request, res: Response) => {
		try {
			const result = await adminUrgencyService.getUrgency();
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getUrgency",
				success: false,
				data: null,
				message: error.message || "دریافت تنظیمات فوریت با خطا مواجه شد",
			});
		}
	};

	updateUrgency = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const result = await adminUrgencyService.updateUrgency(req.body);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "updateUrgency",
				success: false,
				data: null,
				message: error.message || "به‌روزرسانی تنظیمات فوریت با خطا مواجه شد",
			});
		}
	};
}

import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import AdminClubService from "../service/club.admin.service";

const adminClubService = new AdminClubService();

export default class AdminClubController extends ControllerBase {
	getConfig = async (req: Request, res: Response) => {
		try {
			const result = await adminClubService.getConfig();
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getClubConfig",
				success: false,
				data: null,
				message: error.message || "دریافت تنظیمات باشگاه با خطا مواجه شد",
			});
		}
	};

	updateConfig = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const result = await adminClubService.updateConfig(req.body);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "updateClubConfig",
				success: false,
				data: null,
				message: error.message || "به‌روزرسانی تنظیمات باشگاه با خطا مواجه شد",
			});
		}
	};
}

import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import UrgencyService from "../service/urgency.service";

const urgencyService = new UrgencyService();

export default class UrgencyController extends ControllerBase {
	getUrgency = async (req: Request, res: Response) => {
		try {
			const result = await urgencyService.getUrgency();
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
}

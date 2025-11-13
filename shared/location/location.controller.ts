import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../base/controller.base";
import LocationService from "./service/location.service";
import { ControllerError } from "../../types/controllerError.type";
const locationService = new LocationService();

export default class LocationController extends ControllerBase {
	provinces = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const result = await locationService.provinces((req.query.term as string) ?? "", page, pageSize);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "checkUsername",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت استان ها رخ داد",
			});
		}
	};
}

import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import AuthService from "../service/embassy.service";
import { ControllerError } from "../../../../types/controllerError.type";
import EmbassyService from "../service/embassy.service";
import { convertStringToBoolean } from "../../../../shared/utils/convertStringToBoolean.util";
import { GetEmbassiesFilters } from "../dto/getEmbassyFilters.dto";
const embassyService = new EmbassyService();

export default class EmbassyController extends ControllerBase {
	getEmbassies = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const term: string = (req.query.term as string) ?? "";
			const filters: GetEmbassiesFilters = {
				term,
				isActive: true
			};
			const result = await embassyService.getEmbassies(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getEmbassies",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت سفارت‌ها رخ داد",
			});
		}
	};
	getEmbassy = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const embassyId: string = req.params.embassyId ?? "";
			const result = await embassyService.getEmbassy(embassyId, true);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getEmbassy",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت سفارت رخ داد",
			});
		}
	};
}

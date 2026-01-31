import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import EmbassyRateService from "../service/embassyRate.service";
import { GetEmbassyRatesFilters } from "../dto/embassyRateFilters.dto";
const embassyRateService = new EmbassyRateService();

export default class EmbassyRateController extends ControllerBase {
	getEmbassyRates = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = (req.query.translationItemId as string) ?? undefined;
			const filters: GetEmbassyRatesFilters = {
				translationItemId
			};
			const result = await embassyRateService.getEmbassyRates(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getEmbassyRates",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ سفارت رخ داد",
			});
		}
	};
}

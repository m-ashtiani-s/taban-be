import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import ScanRateService from "../service/scanRate.service";
import { GetScanRatesFilters } from "../dto/scanRateFilters.dto";

const scanRateService = new ScanRateService();

export default class ScanRateController extends ControllerBase {
	getScanRates = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = (req.query.translationItemId as string) ?? undefined;
			const filters: GetScanRatesFilters = { translationItemId };
			const result = await scanRateService.getScanRates(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getScanRates",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ اسکن رخ داد",
			});
		}
	};
}

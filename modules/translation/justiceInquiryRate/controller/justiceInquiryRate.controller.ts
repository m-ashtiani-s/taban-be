import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import JusticeInquiryRateService from "../service/justiceInquiryRate.service";
import { GetJusticeInquiryRatesFilters } from "../dto/justiceInquiryRateFilters.dto";
const justiceInquiryRateService = new JusticeInquiryRateService();

export default class JusticeInquiryRateController extends ControllerBase {
	getJusticeInquiryRates = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = (req.query.translationItemId as string) ?? undefined;
			const languageId: string = (req.query.languageId as string) ?? undefined;
			const filters: GetJusticeInquiryRatesFilters = {
				translationItemId,
				languageId,
			};
			const result = await justiceInquiryRateService.getJusticeInquiryRates(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getJusticeInquiryRates",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ استعلام رخ داد",
			});
		}
	};
}

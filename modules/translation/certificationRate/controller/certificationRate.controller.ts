import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import CertificationRateService from "../service/certificationRate.service";
import { GetCertificationRatesFilters } from "../dto/certificationRateFilters.dto";
const certificationRateService = new CertificationRateService();

export default class CertificationRateController extends ControllerBase {
	getCertificationRates = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = (req.query.translationItemId as string) ?? undefined;
			const languageId: string = (req.query.languageId as string) ?? undefined;
			const filters: GetCertificationRatesFilters = {
				translationItemId,
				languageId,
			};
			const result = await certificationRateService.getCertificationRates(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getCertificationRates",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ تاییدیه رخ داد",
			});
		}
	};
}

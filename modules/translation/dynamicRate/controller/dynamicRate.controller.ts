import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import DynamicRateService from "../service/dynamicRate.service";
import { GetDynamicRatesFilters } from "../dto/dynamicRateFilters.dto";
import { DynamicRateInputType } from "../dto/dynamicRateInputType.dto";
import { DynamicRateOption } from "../dto/dynamicRateOption.dto";
const dynamicRateService = new DynamicRateService();

export default class DynamicRateController extends ControllerBase {
	createDynamicRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = req.body.translationItemId;
			const languageId: string = req.body.languageId;
			const price: number = req.body.price;
			const label: string = req.body.label;
			const inputType: DynamicRateInputType = req.body.inputType;
			const options: DynamicRateOption[] = req.body.options;
			const result = await dynamicRateService.createDynamicRate(translationItemId, languageId, price, label, inputType, options);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createDynamicRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد نرخ خاص رخ داد",
			});
		}
	};
	getDynamicRates = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = (req.query.translationItemId as string) ?? undefined;
			const languageId: string = (req.query.languageId as string) ?? undefined;
			const filters: GetDynamicRatesFilters = {
				translationItemId,
				languageId,
			};
			const result = await dynamicRateService.getDynamicRates(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getDynamicRates",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ خاص رخ داد",
			});
		}
	};
}

import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import RateCalculatorService from "../service/rateCalculator.service";
import { RateCalculationRequestDto } from "../dto/rateCalculation.dto";

const rateCalculatorService = new RateCalculatorService();

export default class RateCalculatorController extends ControllerBase {
	calculate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const payload: RateCalculationRequestDto = req.body;
			const result = await rateCalculatorService.calculate(payload);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "calculateRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در محاسبه نرخ رخ داد",
			});
		}
	};
}

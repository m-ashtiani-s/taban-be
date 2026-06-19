import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import RateCalculatorService from "../service/rateCalculator.service";
import { RateCalculationRequestDto } from "../dto/rateCalculation.dto";
import ClubService from "../../club/service/club.service";

const rateCalculatorService = new RateCalculatorService();
const clubService = new ClubService();

export default class RateCalculatorController extends ControllerBase {
	calculate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const payload: RateCalculationRequestDto = req.body;
			// اگر کاربر لاگین‌شده باشد (auth اختیاری)، تخفیف سطح باشگاهش روی نرخ اعمال می‌شود
			const tierDiscountPercent = await clubService.getDiscountPercentForUser(req.user?._id as string | undefined);
			const result = await rateCalculatorService.calculate(payload, tierDiscountPercent);
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

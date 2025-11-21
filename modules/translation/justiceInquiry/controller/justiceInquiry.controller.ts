import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import JusticeInquiryService from "../service/justiceInquiry.service";
import { GetJusticeInquiryiesFilters } from "../dto/getJusticeInquiryFilters.dto";
const justiceInquiryService = new JusticeInquiryService();

export default class JusticeInquiryController extends ControllerBase {
	getJusticeInquiryies = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const term: string = (req.query.term as string) ?? "";
			const filters: GetJusticeInquiryiesFilters = {
				term,
				isActive: true,
			};
			const result = await justiceInquiryService.getJusticeInquiryies(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getJusticeInquiryies",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت استعلام ها رخ داد",
			});
		}
	};
	getJusticeInquiry = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const justiceInquiryId: string = req.params.justiceInquiryId ?? "";
			const result = await justiceInquiryService.getJusticeInquiry(justiceInquiryId, true);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getJusticeInquiry",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت استعلام رخ داد",
			});
		}
	};
}

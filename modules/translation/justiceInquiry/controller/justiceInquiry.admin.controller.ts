import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import JusticeInquiryService from "../service/justiceInquiry.service";
import { GetJusticeInquiryiesFilters } from "../dto/getJusticeInquiryFilters.dto";
import { convertStringToBoolean } from "../../../../shared/utils/convertStringToBoolean.util";
const justiceInquiryService = new JusticeInquiryService();

export class JusticeInquiryAdminController extends ControllerBase {
	createJusticeInquiry = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const justiceInquiryName: string = req.body.justiceInquiryName ?? "";
			const description: string = req.body.description ?? "";
			const result = await justiceInquiryService.createJusticeInquiry(justiceInquiryName, description);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createJusticeInquiry",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد استعلام رخ داد",
			});
		}
	};
	getJusticeInquiryies = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const term: string = (req.query.term as string) ?? "";
			const isActive = convertStringToBoolean((req.query.isActive ?? "") as string);
			const filters: GetJusticeInquiryiesFilters = {
				term,
				isActive
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
			const result = await justiceInquiryService.getJusticeInquiry(justiceInquiryId);
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
	activateJusticeInquiry = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const justiceInquiryId: string = req.params.justiceInquiryId ?? "";
			const result = await justiceInquiryService.activateJusticeInquiry(justiceInquiryId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "activateJusticeInquiry",
				success: false,
				data: null,
				message: error.message || "مشکلی در فعالسازی استعلام رخ داد",
			});
		}
	};
	deactivateJusticeInquiry = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const justiceInquiryId: string = req.params.justiceInquiryId ?? "";
			const result = await justiceInquiryService.deactivateJusticeInquiry(justiceInquiryId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "deactivateJusticeInquiry",
				success: false,
				data: null,
				message: error.message || "مشکلی در غیرفعالسازی استعلام رخ داد",
			});
		}
	};
}

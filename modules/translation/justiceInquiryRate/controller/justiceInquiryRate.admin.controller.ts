import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import JusticeInquiryRateService from "../service/justiceInquiryRate.service";
import { GetJusticeInquiryRatesFilters } from "../dto/justiceInquiryRateFilters.dto";
const justiceInquiryRateService = new JusticeInquiryRateService();

export default class JusticeInquiryRateAdminController extends ControllerBase {
	createJusticeInquiryRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = req.body.translationItemId;
			const languageId: string = req.body.languageId;
			const justiceInquiryId: string = req.body.justiceInquiryId;
			const price: number = req.body.price;
			const result = await justiceInquiryRateService.createJusticeInquiryRate(translationItemId, languageId, justiceInquiryId, price);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createJusticeInquiryRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد نرخ استعلام رخ داد",
			});
		}
	};
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
	getJusticeInquiryRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const justiceInquiryRateId: string = req.params.justiceInquiryRateId;
			const result = await justiceInquiryRateService.getJusticeInquiryRate(justiceInquiryRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getJusticeInquiryRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ استعلام رخ داد",
			});
		}
	};
	deleteJusticeInquiryRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const justiceInquiryRateId: string = req.params.justiceInquiryRateId;
			const result = await justiceInquiryRateService.deleteJusticeInquiryRate(justiceInquiryRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "deleteJusticeInquiryRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در حذف نرخ استعلام رخ داد",
			});
		}
	};
	updateJusticeInquiryRatePrice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const justiceInquiryRateId: string = req.params.justiceInquiryRateId;
			const price: number = +req.body.price;
			const result = await justiceInquiryRateService.updateJusticeInquiryRatePrice(justiceInquiryRateId, price);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateJusticeInquiryRatePrice",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش قیمت نرخ خاص رخ داد",
			});
		}
	};
}

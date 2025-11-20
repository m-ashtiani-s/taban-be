import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import BaseRateService from "../service/baseRate.service";
import { GetBaseRatesFilters } from "../dto/baseRateFilters.dto";
const baseRateService = new BaseRateService();

export default class BaseRateController extends ControllerBase {
	createBaseRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = req.body.translationItemId;
			const languageId: string = req.body.languageId;
			const basePrice: number = req.body.basePrice;
			const result = await baseRateService.createBaseRate(translationItemId, languageId, basePrice);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createBaseRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد نرخ پایه رخ داد",
			});
		}
	};
	getBaseRates = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = (req.query.translationItemId as string) ?? undefined;
			const languageId: string = (req.query.languageId as string) ?? undefined;
			const filters: GetBaseRatesFilters = {
				translationItemId,
				languageId,
			};
			const result = await baseRateService.getBaseRates(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getBaseRates",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ پایه رخ داد",
			});
		}
	};
	getBaseRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const baseRateId: string =req.params.baseRateId;
			const result = await baseRateService.getBaseRate(baseRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getBaseRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ پایه رخ داد",
			});
		}
	};
	deleteBaseRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const baseRateId: string =req.params.baseRateId;
			const result = await baseRateService.deleteBaseRate(baseRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "deleteBaseRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در حذف نرخ پایه رخ داد",
			});
		}
	};
	updateBaseRatePrice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const baseRateId: string =req.params.baseRateId;
			const basePrice: number =+req.body.basePrice;
			const result = await baseRateService.updateBaseRatePrice(baseRateId,basePrice);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateBaseRatePrice",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش قیمت نرخ پایه رخ داد",
			});
		}
	};
}

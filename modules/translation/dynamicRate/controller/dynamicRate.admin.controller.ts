import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import DynamicRateService from "../service/dynamicRate.service";
import { GetDynamicRatesFilters } from "../dto/dynamicRateFilters.dto";
import { DynamicRateUpdateDto } from "../dto/dynamicRateUpdate.dto";
import { DynamicRatesUpdateList } from "../dto/baseRatesUpdateList.dto";
const dynamicRateService = new DynamicRateService();

export default class DynamicRateAdminController extends ControllerBase {
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
			const result = await dynamicRateService.createDynamicRate(translationItemId, languageId, price, label);
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
	getDynamicRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const dynamicRateId: string = req.params.dynamicRateId;
			const result = await dynamicRateService.getDynamicRate(dynamicRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getDynamicRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ خاص رخ داد",
			});
		}
	};
	deleteDynamicRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const dynamicRateId: string = req.params.dynamicRateId;
			const result = await dynamicRateService.deleteDynamicRate(dynamicRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "deleteDynamicRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در حذف نرخ خاص رخ داد",
			});
		}
	};
	updateDynamicRatePrice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const dynamicRateId: string = req.params.dynamicRateId;
			const price: number = +req.body.price;
			const result = await dynamicRateService.updateDynamicRatePrice(dynamicRateId, price);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateDynamicRatePrice",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش قیمت نرخ خاص رخ داد",
			});
		}
	};
	updateDynamicRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const dynamicRateId: string = req.params.dynamicRateId;
			const updateDynamicRateData: DynamicRateUpdateDto = {
				price: req?.body?.price ?? undefined,
				label: req?.body?.label ?? undefined,
			};
			const result = await dynamicRateService.updateDynamicRate(dynamicRateId, updateDynamicRateData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateDynamicRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش نرخ خاص رخ داد",
			});
		}
	};
	bulkUpdateDynamicRatePrice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const bulkUpdateData: DynamicRatesUpdateList[] = req.body.bulkUpdateData;
			const result = await dynamicRateService.bulkUpdateDynamicRatePrice(bulkUpdateData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "bulkUpdateDynamicRatePrice",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش قیمت نرخ های خاص رخ داد",
			});
		}
	};
}

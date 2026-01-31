import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import EmbassyRateService from "../service/embassyRate.service";
import { GetEmbassyRatesFilters } from "../dto/embassyRateFilters.dto";
import { EmbassyRatesUpdateList } from "../dto/embassyRatesUpdateList.dto";
const embassyRateService = new EmbassyRateService();

export default class EmbassyRateAdminController extends ControllerBase {
	createEmbassyRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = req.body.translationItemId;
			const embassyId: string = req.body.embassyId;
			const price: number = req.body.price;
			const result = await embassyRateService.createEmbassyRate(translationItemId, embassyId, price);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createEmbassyRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد نرخ سفارت رخ داد",
			});
		}
	};
	getEmbassyRates = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = (req.query.translationItemId as string) ?? undefined;
			const filters: GetEmbassyRatesFilters = {
				translationItemId,
			};
			const result = await embassyRateService.getEmbassyRates(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getEmbassyRates",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ سفارت رخ داد",
			});
		}
	};
	getEmbassyRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const embassyRateId: string = req.params.embassyRateId;
			const result = await embassyRateService.getEmbassyRate(embassyRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getEmbassyRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ سفارت رخ داد",
			});
		}
	};
	deleteEmbassyRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const embassyRateId: string = req.params.embassyRateId;
			const result = await embassyRateService.deleteEmbassyRate(embassyRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "deleteEmbassyRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در حذف نرخ سفارت رخ داد",
			});
		}
	};
	updateEmbassyRatePrice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const embassyRateId: string = req.params.embassyRateId;
			const price: number = +req.body.price;
			const result = await embassyRateService.updateEmbassyRatePrice(embassyRateId, price);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateEmbassyRatePrice",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش قیمت نرخ خاص رخ داد",
			});
		}
	};
	bulkUpdateEmbassyRatePrice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const bulkUpdateData: EmbassyRatesUpdateList[] = req.body.bulkUpdateData;
			const result = await embassyRateService.bulkUpdateEmbassyRatePrice(bulkUpdateData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "bulkUpdateEmbassyRatePrice",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش قیمت نرخ های سفارت رخ داد",
			});
		}
	};
}

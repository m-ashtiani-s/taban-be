import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import ScanRateService from "../service/scanRate.service";
import { GetScanRatesFilters } from "../dto/scanRateFilters.dto";
import { ScanRatesUpdateList } from "../dto/scanRatesUpdateList.dto";

const scanRateService = new ScanRateService();

export default class ScanRateAdminController extends ControllerBase {
	createScanRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = req.body.translationItemId;
			const price: number = req.body.price;
			const result = await scanRateService.createScanRate(translationItemId, price);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createScanRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد نرخ اسکن رخ داد",
			});
		}
	};

	getScanRates = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = (req.query.translationItemId as string) ?? undefined;
			const filters: GetScanRatesFilters = { translationItemId };
			const result = await scanRateService.getScanRates(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getScanRates",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ اسکن رخ داد",
			});
		}
	};

	getScanRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const scanRateId: string = req.params.scanRateId;
			const result = await scanRateService.getScanRate(scanRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getScanRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ اسکن رخ داد",
			});
		}
	};

	deleteScanRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const scanRateId: string = req.params.scanRateId;
			const result = await scanRateService.deleteScanRate(scanRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "deleteScanRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در حذف نرخ اسکن رخ داد",
			});
		}
	};

	updateScanRatePrice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const scanRateId: string = req.params.scanRateId;
			const price: number = +req.body.price;
			const result = await scanRateService.updateScanRatePrice(scanRateId, price);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateScanRatePrice",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش قیمت نرخ اسکن رخ داد",
			});
		}
	};

	bulkUpdateScanRatePrice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const bulkUpdateData: ScanRatesUpdateList[] = req.body.bulkUpdateData;
			const result = await scanRateService.bulkUpdateScanRatePrice(bulkUpdateData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "bulkUpdateScanRatePrice",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش گروهی نرخ های اسکن رخ داد",
			});
		}
	};
}

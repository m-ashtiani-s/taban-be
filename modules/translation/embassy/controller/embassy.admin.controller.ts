import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import AuthService from "../service/embassy.service";
import { ControllerError } from "../../../../types/controllerError.type";
import EmbassyService from "../service/embassy.service";
import { convertStringToBoolean } from "../../../../shared/utils/convertStringToBoolean.util";
import { GetEmbassiesFilters } from "../dto/getEmbassyFilters.dto";
import { TembassyUpdateDto } from "../dto/embassyUpdateDto.type";
const embassyService = new EmbassyService();

export class EmbassyAdminController extends ControllerBase {
	createEmbassy = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const title: string = req.body.title ?? "";
			const description: string = req.body.description ?? "";
			const result = await embassyService.createEmbassy(title, description);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createEmbassy",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد سفارت رخ داد",
			});
		}
	};
	getEmbassies = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const term: string = (req.query.term as string) ?? "";
			const isActive = convertStringToBoolean((req.query.isActive ?? "") as string);
			const filters: GetEmbassiesFilters = {
				term,
				isActive
			};
			const result = await embassyService.getEmbassies(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getEmbassies",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت سفارت‌ها رخ داد",
			});
		}
	};
	getEmbassy = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const embassyId: string = req.params.embassyId ?? "";
			const result = await embassyService.getEmbassy(embassyId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getEmbassy",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت سفارت رخ داد",
			});
		}
	};
	activateEmbassy = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const embassyId: string = req.params.embassyId ?? "";
			const result = await embassyService.activateEmbassy(embassyId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "activateEmbassy",
				success: false,
				data: null,
				message: error.message || "مشکلی در فعالسازی سفارت رخ داد",
			});
		}
	};
	deactivateEmbassy = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const embassyId: string = req.params.embassyId ?? "";
			const result = await embassyService.deactivateEmbassy(embassyId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "deactivateEmbassy",
				success: false,
				data: null,
				message: error.message || "مشکلی در غیرفعالسازی سفارت رخ داد",
			});
		}
	};
	updateEmbassy = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const embassyId: string = req.params.embassyId ?? "";
			const updateTembassyData: TembassyUpdateDto = {
				title: req?.body?.title ?? "",
				description: req?.body?.description ?? "",
				isActive: req.body.isActive ?? false,
			};
			const result = await embassyService.updateEmbassy(embassyId, updateTembassyData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateEmbassy",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش سفارت رخ داد",
			});
		}
	};
}

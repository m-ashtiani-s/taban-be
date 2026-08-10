import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import LanguageService from "../service/language.service";
import { GetLanguagesFilters } from "../dto/getLanguagesFilters.dto";
import { convertStringToBoolean } from "../../../../shared/utils/convertStringToBoolean.util";
import { LanguageUpdateDto } from "../dto/languageUpdate.dto";
import { LanguageOrderDto } from "../../languageOrder/dto/languageOrder.dto";
const languageService = new LanguageService();

export class LanguageAdminController extends ControllerBase {
	createLanguage = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const languageName: string = req.body.languageName ?? "";
			const languageCode: string = req.body.languageCode ?? "";
			const icon: string = req.body.icon ?? "";
			const result = await languageService.createLanguage(languageName, languageCode, icon);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createLanguage",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد زبان رخ داد",
			});
		}
	};
	getLanguages = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const term: string = (req.query.term as string) ?? "";
			const isActive = convertStringToBoolean((req.query.isActive ?? "") as string);
			const filters: GetLanguagesFilters = {
				term,
				isActive,
			};
			const result = await languageService.getLanguages(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getLanguages",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت زبان ها رخ داد",
			});
		}
	};
	getLanguage = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const languageId: string = req.params.languageId ?? "";
			const result = await languageService.getLanguage(languageId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getLanguage",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت زبان رخ داد",
			});
		}
	};
	activateLanguage = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const languageId: string = req.params.languageId ?? "";
			const result = await languageService.activateLanguage(languageId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "activateLanguage",
				success: false,
				data: null,
				message: error.message || "مشکلی در فعالسازی زبان رخ داد",
			});
		}
	};
	deactivateLanguage = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const languageId: string = req.params.languageId ?? "";
			const result = await languageService.deactivateLanguage(languageId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "deactivateLanguage",
				success: false,
				data: null,
				message: error.message || "مشکلی در غیرفعالسازی زبان رخ داد",
			});
		}
	};
	reorderLanguages = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const orders: LanguageOrderDto[] = (req.body.orders ?? []).map((it: LanguageOrderDto) => ({
				languageId: it.languageId,
				order: it.order,
			}));
			const result = await languageService.reorderLanguages(orders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "reorderLanguages",
				success: false,
				data: null,
				message: error.message || "مشکلی در تغییر ترتیب زبان ها رخ داد",
			});
		}
	};
	updateLanguage = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const languageId: string = req.params.languageId ?? "";
			const updateTLanguageData: LanguageUpdateDto = {
				languageName: req?.body?.languageName ?? "",
				languageCode: req?.body?.languageCode ?? "",
				icon: req?.body?.icon ?? "",
				isActive: req.body.isActive ?? false,
			};
			const result = await languageService.updateLanguage(languageId, updateTLanguageData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateLanguage",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش زبان رخ داد",
			});
		}
	};
	deleteLanguage = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const languageId: string = req.params.languageId ?? "";
			const result = await languageService.deleteLanguage(languageId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "deleteLanguage",
				success: false,
				data: null,
				message: error.message || "مشکلی در حذف زبان رخ داد",
			});
		}
	};
}

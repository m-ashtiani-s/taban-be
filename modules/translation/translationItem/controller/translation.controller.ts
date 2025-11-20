import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import AuthService from "../service/translation.service";
import { ControllerError } from "../../../../types/controllerError.type";
import TranslationService from "../service/translation.service";
import { convertStringToBoolean } from "../../../../shared/utils/convertStringToBoolean.util";
import { GetTranslationItemsFilters } from "../dto/getTranslationItemsFilters.dto";
const translationService = new TranslationService();

export default class TranslationController extends ControllerBase {
	createTranslationItem = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const title: string = req.body.title ?? "";
			const documentType: string = req.body.documentType ?? "";
			const description: string = req.body.description ?? "";
			const result = await translationService.createTranslationItem(title, documentType, description);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createTranslationItem",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد مدرک رخ داد",
			});
		}
	};
	getTranslationItems = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const term: string = (req.query.term as string) ?? "";
			const isActive = convertStringToBoolean((req.query.isActive ?? "") as string);
			const filters: GetTranslationItemsFilters = {
				term,
				isActive,
			};
			const result = await translationService.getTranslationItems(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getTranslationItems",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت مدارک رخ داد",
			});
		}
	};
	getTranslationItem = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const translationItemId: string = req.params.translationItemId ?? "";
			const result = await translationService.getTranslationItem(translationItemId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getTranslationItem",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت مدرک رخ داد",
			});
		}
	};
}

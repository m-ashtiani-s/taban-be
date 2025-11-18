import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import LanguageService from "../service/language.service";
import { GetLanguagesFilters } from "../dto/getLanguagesFilters.dto";
const languageService = new LanguageService();

export default class LanguageController extends ControllerBase {
	createLanguage = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const languageName: string = req.body.languageName ?? "";
			const languageCode: string = req.body.languageCode ?? "";
			const result = await languageService.createLanguage(languageName, languageCode);
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
			const filters: GetLanguagesFilters = {
				term
			};
			const result = await languageService.getLanguages(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getLanguages",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت زبان رخ داد",
			});
		}
	};
}

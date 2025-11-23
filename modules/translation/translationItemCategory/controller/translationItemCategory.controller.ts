import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import TranslationService from "../service/translationItemCategory.service";
import { GetTranslationItemCategoriesFilters } from "../dto/getTranslationItemCategoriesFilters.dto";
const translationService = new TranslationService();

export default class TranslationItemCategoryController extends ControllerBase {
	getTranslationItemCategories = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const term: string = (req.query.term as string) ?? "";
			const filters: GetTranslationItemCategoriesFilters = {
				term
			};
			const result = await translationService.getTranslationItemCategories(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getTranslationItemCategories",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت دسته‌بندی ها رخ داد",
			});
		}
	};
	getTranslationItemCategory = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const translationItemCategoryId: string = req.params.translationItemCategoryId ?? "";
			const result = await translationService.getTranslationItemCategory(translationItemCategoryId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getTranslationItemCategory",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت دسته‌بندی رخ داد",
			});
		}
	};
}

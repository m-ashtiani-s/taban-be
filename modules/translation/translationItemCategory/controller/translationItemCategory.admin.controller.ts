import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import AuthService from "../service/translationItemCategory.service";
import { ControllerError } from "../../../../types/controllerError.type";
import TranslationService from "../service/translationItemCategory.service";
import { convertStringToBoolean } from "../../../../shared/utils/convertStringToBoolean.util";
import { TranslationItemCategoryUpdateDto } from "../dto/translationItemCategoryUpdate.dto";
import { GetTranslationItemCategoriesFilters } from "../dto/getTranslationItemCategoriesFilters.dto";
const translationService = new TranslationService();

export class TranslationItemCategoryAdminController extends ControllerBase {
	createTranslationItemCategory = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const title: string = req.body.title ?? "";
			const result = await translationService.createTranslationItemCategory(title);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createTranslationItemCategory",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد دسته‌بندی رخ داد",
			});
		}
	};
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
	
	updateTranslationItemCategory = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const translationItemCategoryId: string = req.params.translationItemCategoryId ?? "";
			const updateTtranslationItemCategoryData: TranslationItemCategoryUpdateDto = {
				title: req?.body?.title ?? ""
			};
			const result = await translationService.updateTranslationItemCategory(translationItemCategoryId, updateTtranslationItemCategoryData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateTranslationItemCategory",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش دسته‌بندی رخ داد",
			});
		}
	};
	deleteTranslationItemCategory = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const translationItemCategoryId: string = req.params.translationItemCategoryId ?? "";
			const result = await translationService.deleteTranslationItemCategory(translationItemCategoryId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "deleteTranslationItemCategory",
				success: false,
				data: null,
				message: error.message || "مشکلی در حذف دسته‌بندی رخ داد",
			});
		}
	};
}

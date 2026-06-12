import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import AdminPassportService from "../service/passport.admin.service";
import { PassportFilters } from "../dto/passportFilters.dto";

const adminPassportService = new AdminPassportService();

export default class AdminPassportController extends ControllerBase {
	getPassports = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const term = (req.query.term as string) ?? undefined;
			const isActiveRaw = (req.query.isActive as string) ?? undefined;
			const userId = (req.query.userId as string) ?? undefined;
			const filters: PassportFilters = {
				term,
				isActive: isActiveRaw !== undefined ? isActiveRaw === "true" : undefined,
				userId,
			};
			const result = await adminPassportService.getPassports(filters, page, pageSize, sortOrders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getPassports",
				success: false,
				data: null,
				message: error.message || "دریافت لیست پاسپورت‌ها با خطا مواجه شد",
			});
		}
	};

	getPassportById = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const passportId: string = req.params.passportId;
			const result = await adminPassportService.getPassportById(passportId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getPassportById",
				success: false,
				data: null,
				message: error.message || "دریافت اطلاعات پاسپورت با خطا مواجه شد",
			});
		}
	};

	activatePassport = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const passportId: string = req.params.passportId;
			const result = await adminPassportService.activatePassport(passportId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "activatePassport",
				success: false,
				data: null,
				message: error.message || "فعال‌سازی پاسپورت با خطا مواجه شد",
			});
		}
	};

	deactivatePassport = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const passportId: string = req.params.passportId;
			const result = await adminPassportService.deactivatePassport(passportId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "deactivatePassport",
				success: false,
				data: null,
				message: error.message || "غیرفعال‌سازی پاسپورت با خطا مواجه شد",
			});
		}
	};
}

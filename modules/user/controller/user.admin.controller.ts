import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import AdminUserService from "../service/user.admin.service";
import { AdminUserFilters } from "../dto/user.admin.dto";
import { CustomerType, UserType } from "../model/user.model";

const adminUserService = new AdminUserService();

export default class AdminUserController extends ControllerBase {
	getUsers = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const isActiveRaw = (req.query.isActive as string) ?? undefined;
			const filters: AdminUserFilters = {
				term: (req.query.term as string) ?? undefined,
				customerType: (req.query.customerType as CustomerType) ?? undefined,
				userType: (req.query.userType as UserType) ?? undefined,
				isActive: isActiveRaw !== undefined ? isActiveRaw === "true" : undefined,
			};
			const result = await adminUserService.getUsers(filters, page, pageSize, sortOrders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getUsers",
				success: false,
				data: null,
				message: error.message || "دریافت لیست کاربران با خطا مواجه شد",
			});
		}
	};

	getUserById = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const userId: string = req.params.userId;
			const result = await adminUserService.getUserById(userId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getUserById",
				success: false,
				data: null,
				message: error.message || "دریافت اطلاعات کاربر با خطا مواجه شد",
			});
		}
	};

	updateUser = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const userId: string = req.params.userId;
			const result = await adminUserService.updateUser(userId, req.body);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "updateUser",
				success: false,
				data: null,
				message: error.message || "ویرایش کاربر با خطا مواجه شد",
			});
		}
	};

	activateUser = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const userId: string = req.params.userId;
			const result = await adminUserService.activateUser(userId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "activateUser",
				success: false,
				data: null,
				message: error.message || "فعال‌سازی کاربر با خطا مواجه شد",
			});
		}
	};

	deactivateUser = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const userId: string = req.params.userId;
			const result = await adminUserService.deactivateUser(userId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "deactivateUser",
				success: false,
				data: null,
				message: error.message || "غیرفعال‌سازی کاربر با خطا مواجه شد",
			});
		}
	};
}

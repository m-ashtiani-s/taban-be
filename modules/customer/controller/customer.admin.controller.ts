import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import AdminCustomerService from "../service/customer.admin.service";
import { AdminCustomerFilters } from "../dto/customerFilters.admin.dto";
import { UpdateCustomerDto } from "../dto/customer.dto";

const adminCustomerService = new AdminCustomerService();

export default class AdminCustomerController extends ControllerBase {
	getCustomers = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const provinceCodeRaw = (req.query.provinceCode as string) ?? undefined;
			const cityCodeRaw = (req.query.cityCode as string) ?? undefined;
			const isActiveRaw = (req.query.isActive as string) ?? undefined;
			const filters: AdminCustomerFilters = {
				term: (req.query.term as string) ?? undefined,
				enterpriseId: (req.query.enterpriseId as string) ?? undefined,
				provinceCode: provinceCodeRaw !== undefined ? Number(provinceCodeRaw) : undefined,
				cityCode: cityCodeRaw !== undefined ? Number(cityCodeRaw) : undefined,
				isActive: isActiveRaw !== undefined ? isActiveRaw === "true" : undefined,
			};
			const result = await adminCustomerService.getCustomers(filters, page, pageSize, sortOrders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getCustomers",
				success: false,
				data: null,
				message: error.message || "دریافت لیست مشتریان با خطا مواجه شد",
			});
		}
	};

	getCustomerById = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const customerId: string = req.params.customerId;
			const result = await adminCustomerService.getCustomerById(customerId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getCustomerById",
				success: false,
				data: null,
				message: error.message || "دریافت اطلاعات مشتری با خطا مواجه شد",
			});
		}
	};

	updateCustomer = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const customerId: string = req.params.customerId;
			const updateCustomerData: UpdateCustomerDto = {
				firstName: req.body?.firstName?.trim(),
				lastName: req.body?.lastName?.trim(),
				nationalId: req.body?.nationalId?.trim(),
				phoneNumber: req.body?.phoneNumber?.trim(),
				provinceName: req.body?.provinceName?.trim(),
				provinceCode: req.body?.provinceCode,
				cityName: req.body?.cityName?.trim(),
				cityCode: req.body?.cityCode,
				isActive: req.body?.isActive ?? true,
			};
			const userId = req.user?._id as string;
			const result = await adminCustomerService.updateCustomer(customerId, updateCustomerData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "updateCustomer",
				success: false,
				data: null,
				message: error.message || "ویرایش مشتری با خطا مواجه شد",
			});
		}
	};

	activateCustomer = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const customerId: string = req.params.customerId;
			const result = await adminCustomerService.activateCustomer(customerId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "activateCustomer",
				success: false,
				data: null,
				message: error.message || "فعال‌سازی مشتری با خطا مواجه شد",
			});
		}
	};

	deactivateCustomer = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const customerId: string = req.params.customerId;
			const result = await adminCustomerService.deactivateCustomer(customerId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "deactivateCustomer",
				success: false,
				data: null,
				message: error.message || "غیرفعال‌سازی مشتری با خطا مواجه شد",
			});
		}
	};
}

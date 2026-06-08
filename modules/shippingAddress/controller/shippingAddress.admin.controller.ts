import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import AdminShippingAddressService from "../service/shippingAddress.admin.service";
import { ShippingAddressFilters } from "../dto/shippingAddressFilters.dto";

const adminShippingAddressService = new AdminShippingAddressService();

export default class AdminShippingAddressController extends ControllerBase {
	getShippingAddresses = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const term = (req.query.term as string) ?? undefined;
			const provinceCodeRaw = (req.query.provinceCode as string) ?? undefined;
			const cityCodeRaw = (req.query.cityCode as string) ?? undefined;
			const isActiveRaw = (req.query.isActive as string) ?? undefined;
			const userId = (req.query.userId as string) ?? undefined;
			const filters: ShippingAddressFilters = {
				term,
				provinceCode: provinceCodeRaw !== undefined ? Number(provinceCodeRaw) : undefined,
				cityCode: cityCodeRaw !== undefined ? Number(cityCodeRaw) : undefined,
				isActive: isActiveRaw !== undefined ? isActiveRaw === "true" : undefined,
				userId,
			};
			const result = await adminShippingAddressService.getShippingAddresses(filters, page, pageSize, sortOrders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getShippingAddresses",
				success: false,
				data: null,
				message: error.message || "دریافت لیست آدرس‌ها با خطا مواجه شد",
			});
		}
	};

	getShippingAddressById = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const shippingAddressId: string = req.params.shippingAddressId;
			const result = await adminShippingAddressService.getShippingAddressById(shippingAddressId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getShippingAddressById",
				success: false,
				data: null,
				message: error.message || "دریافت اطلاعات آدرس با خطا مواجه شد",
			});
		}
	};

	updateShippingAddress = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const shippingAddressId: string = req.params.shippingAddressId;
			const updateShippingAddressData = {
			title: req.body.title?.trim(),
			provinceName: req.body.provinceName?.trim(),
			provinceCode: req.body.provinceCode,
			cityName: req.body.cityName?.trim(),
			cityCode: req.body.cityCode,
			plaque: req.body.plaque?.trim() || null,
			unit: req.body.unit?.trim() || null,
			fullAddress: req.body.fullAddress?.trim(),
			addressDescription: req.body.addressDescription?.trim() || null,
			landlineNumber: req.body.landlineNumber?.trim() || null,
			isActive: req.body.isActive ?? true,
		}
			const result = await adminShippingAddressService.updateShippingAddress(shippingAddressId, updateShippingAddressData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "updateShippingAddress",
				success: false,
				data: null,
				message: error.message || "ویرایش آدرس با خطا مواجه شد",
			});
		}
	};

	activateShippingAddress = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const shippingAddressId: string = req.params.shippingAddressId;
			const result = await adminShippingAddressService.activateShippingAddress(shippingAddressId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "activateShippingAddress",
				success: false,
				data: null,
				message: error.message || "فعال‌سازی آدرس با خطا مواجه شد",
			});
		}
	};

	deactivateShippingAddress = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const shippingAddressId: string = req.params.shippingAddressId;
			const result = await adminShippingAddressService.deactivateShippingAddress(shippingAddressId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "deactivateShippingAddress",
				success: false,
				data: null,
				message: error.message || "غیرفعال‌سازی آدرس با خطا مواجه شد",
			});
		}
	};
}

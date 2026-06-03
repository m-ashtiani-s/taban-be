import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import AdminCouponService from "../service/adminCoupon.service";
import { CouponFilters } from "../dto/coupon.dto";

const adminCouponService = new AdminCouponService();

export default class AdminCouponController extends ControllerBase {
	getCoupons = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const term = (req.query.term as string) ?? undefined;
			const discountType = (req.query.discountType as "percent" | "fixed") ?? undefined;
			const appliesTo = (req.query.appliesTo as "base" | "total") ?? undefined;
			const isActiveRaw = (req.query.isActive as string) ?? undefined;
			const filters: CouponFilters = {
				term,
				discountType,
				appliesTo,
				isActive: isActiveRaw !== undefined ? isActiveRaw === "true" : undefined,
			};
			const result = await adminCouponService.getCoupons(filters, page, pageSize, sortOrders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getCoupons",
				success: false,
				data: null,
				message: error.message || "دریافت لیست کدهای تخفیف با خطا مواجه شد",
			});
		}
	};

	getCouponById = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const couponId: string = req.params.couponId;
			const result = await adminCouponService.getCouponById(couponId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getCouponById",
				success: false,
				data: null,
				message: error.message || "دریافت اطلاعات کد تخفیف با خطا مواجه شد",
			});
		}
	};

	createCoupon = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const result = await adminCouponService.createCoupon(req.body);
			return res.status(201).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createCoupon",
				success: false,
				data: null,
				message: error.message || "ایجاد کد تخفیف با خطا مواجه شد",
			});
		}
	};

	updateCoupon = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const couponId: string = req.params.couponId;
			const result = await adminCouponService.updateCoupon(couponId, req.body);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "updateCoupon",
				success: false,
				data: null,
				message: error.message || "ویرایش کد تخفیف با خطا مواجه شد",
			});
		}
	};

	activateCoupon = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const couponId: string = req.params.couponId;
			const result = await adminCouponService.activateCoupon(couponId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "activateCoupon",
				success: false,
				data: null,
				message: error.message || "فعال‌سازی کد تخفیف با خطا مواجه شد",
			});
		}
	};

	deactivateCoupon = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const couponId: string = req.params.couponId;
			const result = await adminCouponService.deactivateCoupon(couponId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "deactivateCoupon",
				success: false,
				data: null,
				message: error.message || "غیرفعال‌سازی کد تخفیف با خطا مواجه شد",
			});
		}
	};
}

import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import AdminOrderService from "../service/order.admin.service";
import { OrderFilters } from "../dto/orderFilters.dto";
import { OrderStatus, PaymentStatus } from "../model/order.model";

const adminOrderService = new AdminOrderService();

export default class AdminOrderController extends ControllerBase {
	getOrders = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const filters: OrderFilters = {
				term: (req.query.term as string) ?? undefined,
				status: (req.query.status as OrderStatus) ?? undefined,
				paymentStatus: (req.query.paymentStatus as PaymentStatus) ?? undefined,
				dateFrom: (req.query.dateFrom as string) ?? undefined,
				dateTo: (req.query.dateTo as string) ?? undefined,
				userId: (req.query.userId as string) ?? undefined,
				customerId: (req.query.customerId as string) ?? undefined,
			};
			const result = await adminOrderService.getOrders(filters, page, pageSize, sortOrders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getOrders",
				success: false,
				data: null,
				message: error.message || "دریافت لیست سفارش‌ها با خطا مواجه شد",
			});
		}
	};

	getOrderById = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const orderId: string = req.params.orderId;
			const result = await adminOrderService.getOrderById(orderId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getOrderById",
				success: false,
				data: null,
				message: error.message || "دریافت اطلاعات سفارش با خطا مواجه شد",
			});
		}
	};

	updateOrderStatus = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const orderId: string = req.params.orderId;
			const result = await adminOrderService.updateOrderStatus(orderId, req.body);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "updateOrderStatus",
				success: false,
				data: null,
				message: error.message || "تغییر وضعیت سفارش با خطا مواجه شد",
			});
		}
	};
}

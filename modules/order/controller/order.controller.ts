import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import OrderService from "../service/order.service";
import OrderInvoiceService from "../service/orderInvoice.service";
import { OrderFilters } from "../dto/orderFilters.dto";
import { OrderStatus, PaymentStatus } from "../model/order.model";

const orderService = new OrderService();
const orderInvoiceService = new OrderInvoiceService();

export default class OrderController extends ControllerBase {
	createOrder = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const result = await orderService.createOrder(req.user?._id as string, req.body);
			return res.status(201).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "createOrder",
				success: false,
				data: null,
				message: error.message || "ثبت سفارش با خطا مواجه شد",
			});
		}
	};

	getOrders = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const filters: OrderFilters = {
				status: (req.query.status as OrderStatus) ?? undefined,
				paymentStatus: (req.query.paymentStatus as PaymentStatus) ?? undefined,
				customerId: (req.query.customerId as string) ?? undefined,
				withCustomer: req.query.withCustomer === "true" ? true : undefined,
			};
			const result = await orderService.getOrders(req.user?._id as string, filters, page, pageSize, sortOrders);
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
			const result = await orderService.getOrderById(req.user?._id as string, orderId);
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

	payOrder = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const orderId: string = req.params.orderId;
			const result = await orderService.payOrder(req.user?._id as string, orderId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "payOrder",
				success: false,
				data: null,
				message: error.message || "پرداخت سفارش با خطا مواجه شد",
			});
		}
	};

	updateOrderItem = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const orderId: string = req.params.orderId;
			const cartItemId: string = req.params.cartItemId;
			const result = await orderService.updateOrderItem(req.user?._id as string, orderId, cartItemId, req.body);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "updateOrderItem",
				success: false,
				data: null,
				message: error.message || "ویرایش آیتم سفارش با خطا مواجه شد",
			});
		}
	};

	downloadInvoice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const orderId: string = req.params.orderId;
			const { buffer, fileName } = await orderInvoiceService.getOrderInvoicePdf(req.user?._id as string, orderId);
			// فایل را به‌صورت JSON/base64 می‌فرستیم تا دانلودرهای خارجی (مثل IDM) پاسخ را
			// به‌عنوان فایل دانلودی شناسایی نکنند و درخواست را بدون توکن دوباره صدا نزنند (۴۰۱).
			return res.status(200).json({
				field: "downloadInvoice",
				success: true,
				data: { fileName, mimeType: "application/pdf", base64: buffer.toString("base64") },
				message: "",
			});
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "downloadInvoice",
				success: false,
				data: null,
				message: error.message || "صدور فاکتور با خطا مواجه شد",
			});
		}
	};

	removeCouponFromOrder = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const orderId: string = req.params.orderId;
			const result = await orderService.removeCouponFromOrder(req.user?._id as string, orderId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "removeCouponFromOrder",
				success: false,
				data: null,
				message: error.message || "حذف کد تخفیف از سفارش با خطا مواجه شد",
			});
		}
	};
}

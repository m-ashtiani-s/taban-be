import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import AdminInvoiceService from "../service/invoice.admin.service";
import { InvoiceFilters } from "../dto/invoiceFilters.dto";
import { InvoiceIssuerType, InvoiceReferenceType, InvoiceStatus } from "../model/invoice.model";

const adminInvoiceService = new AdminInvoiceService();

export default class AdminInvoiceController extends ControllerBase {
	getInvoices = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const filters: InvoiceFilters = {
				term: (req.query.term as string) ?? undefined,
				status: (req.query.status as InvoiceStatus) ?? undefined,
				referenceType: (req.query.referenceType as InvoiceReferenceType) ?? undefined,
				issuerType: (req.query.issuerType as InvoiceIssuerType) ?? undefined,
				userId: (req.query.userId as string) ?? undefined,
				dateFrom: (req.query.dateFrom as string) ?? undefined,
				dateTo: (req.query.dateTo as string) ?? undefined,
			};
			const result = await adminInvoiceService.getInvoices(filters, page, pageSize, sortOrders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getInvoices",
				success: false,
				data: null,
				message: error.message || "دریافت لیست صورتحساب‌ها با خطا مواجه شد",
			});
		}
	};

	getInvoiceById = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const invoiceId: string = req.params.invoiceId;
			const result = await adminInvoiceService.getInvoiceById(invoiceId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getInvoiceById",
				success: false,
				data: null,
				message: error.message || "دریافت اطلاعات صورتحساب با خطا مواجه شد",
			});
		}
	};

	getOrderInvoices = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const orderId: string = req.params.orderId;
			const result = await adminInvoiceService.getOrderInvoices(orderId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getOrderInvoices",
				success: false,
				data: null,
				message: error.message || "دریافت صورتحساب‌های سفارش با خطا مواجه شد",
			});
		}
	};

	createInvoice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const issuedById = (req.user?._id as string) ?? null;
			const result = await adminInvoiceService.createInvoice(req.body, issuedById);
			return res.status(201).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createInvoice",
				success: false,
				data: null,
				message: error.message || "ایجاد صورتحساب با خطا مواجه شد",
			});
		}
	};

	updateInvoice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const invoiceId: string = req.params.invoiceId;
			const result = await adminInvoiceService.updateInvoice(invoiceId, req.body);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "updateInvoice",
				success: false,
				data: null,
				message: error.message || "ویرایش صورتحساب با خطا مواجه شد",
			});
		}
	};

	issueInvoice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const invoiceId: string = req.params.invoiceId;
			const result = await adminInvoiceService.issueInvoice(invoiceId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "issueInvoice",
				success: false,
				data: null,
				message: error.message || "صدور صورتحساب با خطا مواجه شد",
			});
		}
	};

	cancelInvoice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const invoiceId: string = req.params.invoiceId;
			const result = await adminInvoiceService.cancelInvoice(invoiceId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "cancelInvoice",
				success: false,
				data: null,
				message: error.message || "لغو صورتحساب با خطا مواجه شد",
			});
		}
	};

	deleteInvoice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const invoiceId: string = req.params.invoiceId;
			const result = await adminInvoiceService.deleteInvoice(invoiceId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "deleteInvoice",
				success: false,
				data: null,
				message: error.message || "حذف صورتحساب با خطا مواجه شد",
			});
		}
	};
}

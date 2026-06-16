import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import InvoiceService from "../service/invoice.service";
import { InvoiceFilters } from "../dto/invoiceFilters.dto";
import { InvoiceStatus } from "../model/invoice.model";

const invoiceService = new InvoiceService();

export default class InvoiceController extends ControllerBase {
	getMyInvoices = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const filters: InvoiceFilters = {
				term: (req.query.term as string) ?? undefined,
				status: (req.query.status as InvoiceStatus) ?? undefined,
				dateFrom: (req.query.dateFrom as string) ?? undefined,
				dateTo: (req.query.dateTo as string) ?? undefined,
			};
			const result = await invoiceService.getMyInvoices(req.user?._id as string, filters, page, pageSize, sortOrders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getMyInvoices",
				success: false,
				data: null,
				message: error.message || "دریافت لیست صورتحساب‌ها با خطا مواجه شد",
			});
		}
	};

	getMyInvoiceById = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const invoiceId: string = req.params.invoiceId;
			const result = await invoiceService.getMyInvoiceById(req.user?._id as string, invoiceId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getMyInvoiceById",
				success: false,
				data: null,
				message: error.message || "دریافت اطلاعات صورتحساب با خطا مواجه شد",
			});
		}
	};

	payInvoice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const invoiceId: string = req.params.invoiceId;
			const result = await invoiceService.payInvoice(req.user?._id as string, invoiceId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "payInvoice",
				success: false,
				data: null,
				message: error.message || "پرداخت صورتحساب با خطا مواجه شد",
			});
		}
	};
}

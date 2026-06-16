import mongoose from "mongoose";
import Config from "../../../config/config";
import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import type { OrderDocument } from "../../order/model/order.model";
import UserRepository from "../../user/repository/user.repository";
import { CreateInvoiceDto, InvoiceItemInput, UpdateInvoiceDto } from "../dto/invoice.dto";
import { InvoiceFilters } from "../dto/invoiceFilters.dto";
import {
	InvoiceIssuerType,
	InvoiceItem,
	InvoiceReferenceType,
	InvoiceStatus,
} from "../model/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceTransform from "../transform/invoice.transform";

export default class AdminInvoiceService {
	private invoiceRepository = new InvoiceRepository();
	private userRepository = new UserRepository();
	private invoiceTransform = new InvoiceTransform();

	async getInvoices(filters: InvoiceFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.invoiceRepository.findPaginated(filters, pagination.getOptions());
		return {
			field: "getInvoices",
			success: true,
			message: "لیست صورتحساب‌ها با موفقیت دریافت شد",
			data: this.invoiceTransform.paginatedInvoices(paginated),
		};
	}

	async getInvoiceById(invoiceId: string) {
		const invoice = await this.invoiceRepository.findById(invoiceId);
		if (!invoice) throw new NotFoundError("صورتحساب یافت نشد");
		return {
			field: "getInvoiceById",
			success: true,
			message: "صورتحساب با موفقیت دریافت شد",
			data: this.invoiceTransform.invoice(invoice),
		};
	}

	async getOrderInvoices(orderId: string) {
		const invoices = await this.invoiceRepository.findByReference(InvoiceReferenceType.ORDER, orderId);
		return {
			field: "getOrderInvoices",
			success: true,
			message: "صورتحساب‌های سفارش با موفقیت دریافت شد",
			data: this.invoiceTransform.invoices(invoices),
		};
	}

	async createInvoice(data: CreateInvoiceDto, issuedById?: string | null) {
		const user = await this.userRepository.findByUserId(data.userId);
		if (!user) throw new BadRequestError("کاربر انتخاب‌شده معتبر نیست");

		if (!data.items || data.items.length === 0) {
			throw new BadRequestError("حداقل یک ردیف برای صورتحساب الزامی است");
		}

		const reference = this.normalizeReference(data);
		const amounts = this.computeAmounts(data.items);

		const invoiceNumber = await this.invoiceRepository.getNextInvoiceNumber();
		const invoice = await this.invoiceRepository.create({
			invoiceNumber,
			...reference,
			user: data.userId,
			subject: data.subject.trim(),
			description: data.description?.trim() || null,
			...amounts,
			status: InvoiceStatus.CREATED,
			issuerType: InvoiceIssuerType.ADMIN,
			issuedBy: issuedById ?? null,
			paymentDetail: null,
			paidAt: null,
		});

		const populated = await this.invoiceRepository.findById((invoice._id as any).toString());
		return {
			field: "createInvoice",
			success: true,
			message: "صورتحساب با موفقیت ایجاد شد",
			data: this.invoiceTransform.invoice(populated ?? invoice),
		};
	}

	async updateInvoice(invoiceId: string, data: UpdateInvoiceDto) {
		const invoice = await this.invoiceRepository.findById(invoiceId);
		if (!invoice) throw new NotFoundError("صورتحساب یافت نشد");
		if (invoice.status !== InvoiceStatus.CREATED) {
			throw new BadRequestError("فقط صورتحساب در وضعیت «ایجاد شده» قابل ویرایش است");
		}

		const update: Record<string, unknown> = {};
		if (data.subject !== undefined) update.subject = data.subject.trim();
		if (data.description !== undefined) update.description = data.description?.trim() || null;
		if (data.items !== undefined) {
			if (!data.items.length) throw new BadRequestError("حداقل یک ردیف برای صورتحساب الزامی است");
			Object.assign(update, this.computeAmounts(data.items));
		}

		const updated = await this.invoiceRepository.update(invoiceId, update);
		return {
			field: "updateInvoice",
			success: true,
			message: "صورتحساب با موفقیت ویرایش شد",
			data: this.invoiceTransform.invoice(updated!),
		};
	}

	async issueInvoice(invoiceId: string) {
		const invoice = await this.invoiceRepository.findById(invoiceId);
		if (!invoice) throw new NotFoundError("صورتحساب یافت نشد");
		if (invoice.status !== InvoiceStatus.CREATED) {
			throw new BadRequestError("فقط صورتحساب در وضعیت «ایجاد شده» قابل صدور است");
		}

		const updated = await this.invoiceRepository.update(invoiceId, { status: InvoiceStatus.ISSUED });
		return {
			field: "issueInvoice",
			success: true,
			message: "صورتحساب با موفقیت صادر شد",
			data: this.invoiceTransform.invoice(updated!),
		};
	}

	async cancelInvoice(invoiceId: string) {
		const invoice = await this.invoiceRepository.findById(invoiceId);
		if (!invoice) throw new NotFoundError("صورتحساب یافت نشد");
		if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.CANCELED) {
			throw new BadRequestError("صورتحساب پرداخت‌شده یا لغوشده قابل لغو نیست");
		}

		const updated = await this.invoiceRepository.update(invoiceId, { status: InvoiceStatus.CANCELED });
		return {
			field: "cancelInvoice",
			success: true,
			message: "صورتحساب با موفقیت لغو شد",
			data: this.invoiceTransform.invoice(updated!),
		};
	}

	/** حذف نرم: صورتحساب با isActive=false دیگر در هیچ لیست یا جزئیاتی نمایش داده نمی‌شود. */
	async deleteInvoice(invoiceId: string) {
		const invoice = await this.invoiceRepository.findById(invoiceId);
		if (!invoice) throw new NotFoundError("صورتحساب یافت نشد");

		await this.invoiceRepository.update(invoiceId, { isActive: false });
		return {
			field: "deleteInvoice",
			success: true,
			message: "صورتحساب با موفقیت حذف شد",
			data: null,
		};
	}

	/**
	 * صدور خودکار صورتحساب هنگام پرداخت سفارش. صورتحساب با وضعیت «صادر شده» ساخته می‌شود و
	 * چون سفارش همان لحظه پرداخت شده، متعاقباً به «پرداخت‌شده» منتقل می‌گردد. این متد توسط
	 * سرویس سفارش و درون همان تراکنش فراخوانی می‌شود تا سفارش و صورتحساب اتمیک بمانند.
	 * در صورت وجود صورتحساب قبلی برای این سفارش، کاری انجام نمی‌شود (idempotent).
	 */
	async issueForPaidOrder(order: OrderDocument, session?: mongoose.ClientSession): Promise<void> {
		const orderId = (order._id as any)?.toString?.() ?? String(order._id);

		const existing = await this.invoiceRepository.findOneByReference(InvoiceReferenceType.ORDER, orderId, session);
		if (existing) return;

		const userId = ((order.user as any)?._id ?? order.user)?.toString();
		const amounts = this.computeAmounts([
			{ title: `بابت سفارش شماره ${order.orderNumber}`, quantity: 1, unitPrice: order.finalAmount ?? 0 },
		]);

		const invoiceNumber = await this.invoiceRepository.getNextInvoiceNumber(session);
		const created = await this.invoiceRepository.create(
			{
				invoiceNumber,
				referenceType: InvoiceReferenceType.ORDER,
				referenceId: orderId as any,
				referenceNumber: order.orderNumber,
				user: userId as any,
				subject: `صورتحساب سفارش شماره ${order.orderNumber}`,
				description: null,
				...amounts,
				status: InvoiceStatus.ISSUED,
				issuerType: InvoiceIssuerType.SYSTEM,
				issuedBy: null,
				paymentDetail: null,
				paidAt: null,
			},
			session
		);

		await this.invoiceRepository.update(
			(created._id as any).toString(),
			{ status: InvoiceStatus.PAID, paidAt: new Date() },
			session
		);
	}

	private normalizeReference(data: CreateInvoiceDto) {
		if (!data.referenceType) {
			return { referenceType: null, referenceId: null, referenceNumber: null };
		}
		return {
			referenceType: data.referenceType,
			referenceId: data.referenceId ?? null,
			referenceNumber: data.referenceNumber ?? null,
		};
	}

	private computeAmounts(items: InvoiceItemInput[]) {
		const normalizedItems: InvoiceItem[] = items.map((it) => ({
			title: it.title.trim(),
			quantity: it.quantity,
			unitPrice: it.unitPrice,
			total: it.quantity * it.unitPrice,
		}));
		const subtotal = normalizedItems.reduce((sum, it) => sum + it.total, 0);
		const vatRate = Config.invoice.vatRate;
		const vatAmount = Math.round(subtotal * vatRate);
		const totalAmount = subtotal + vatAmount;
		return { items: normalizedItems, subtotal, vatRate, vatAmount, totalAmount };
	}
}

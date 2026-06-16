import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import { InvoiceFilters } from "../dto/invoiceFilters.dto";
import { InvoiceStatus } from "../model/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceTransform from "../transform/invoice.transform";

export default class InvoiceService {
	private invoiceRepository = new InvoiceRepository();
	private invoiceTransform = new InvoiceTransform();

	async getMyInvoices(userId: string, filters: InvoiceFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.invoiceRepository.findPaginatedByUser(userId, filters, pagination.getOptions());
		return {
			field: "getMyInvoices",
			success: true,
			message: "لیست صورتحساب‌ها با موفقیت دریافت شد",
			data: this.invoiceTransform.paginatedInvoices(paginated),
		};
	}

	async getMyInvoiceById(userId: string, invoiceId: string) {
		const invoice = await this.invoiceRepository.findByIdAndUser(invoiceId, userId);
		if (!invoice) throw new NotFoundError("صورتحساب یافت نشد");
		return {
			field: "getMyInvoiceById",
			success: true,
			message: "صورتحساب با موفقیت دریافت شد",
			data: this.invoiceTransform.invoice(invoice),
		};
	}

	// TODO: این یک پیاده‌سازی موقت است. در آینده باید با درگاه پرداخت واقعی جایگزین شود
	// (هدایت به درگاه، ساخت تراکنش، و تایید پرداخت از طریق callback درگاه).
	async payInvoice(userId: string, invoiceId: string) {
		const invoice = await this.invoiceRepository.findByIdAndUser(invoiceId, userId);
		if (!invoice) throw new NotFoundError("صورتحساب یافت نشد");
		if (invoice.status !== InvoiceStatus.ISSUED) {
			throw new BadRequestError("این صورتحساب در وضعیت قابل پرداخت قرار ندارد");
		}

		const updated = await this.invoiceRepository.update((invoice._id as any).toString(), {
			status: InvoiceStatus.PAID,
			paidAt: new Date(),
		});
		return {
			field: "payInvoice",
			success: true,
			message: "پرداخت صورتحساب با موفقیت انجام شد",
			data: this.invoiceTransform.invoice(updated!),
		};
	}
}

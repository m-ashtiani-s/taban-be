import Config from "../../../config/config";
import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import { renderHtmlToPdf } from "../../../shared/utils/pdf.util";
import UserRepository from "../../user/repository/user.repository";
import OrderRepository from "../repository/order.repository";
import { OrderDocument, PaymentStatus } from "../model/order.model";
import {
	buildOrderInvoiceHtml,
	InvoiceLineItem,
	InvoiceParty,
	jalaliDate,
	jalaliDateTime,
	OrderInvoiceViewModel,
} from "../invoice/orderInvoiceHtml";

export interface OrderInvoicePdf {
	buffer: Buffer;
	fileName: string;
}

export default class OrderInvoiceService {
	private orderRepository = new OrderRepository();
	private userRepository = new UserRepository();

	async getOrderInvoicePdf(userId: string, orderId: string): Promise<OrderInvoicePdf> {
		const order = await this.orderRepository.findByIdAndUser(orderId, userId);
		if (!order) throw new NotFoundError("سفارش یافت نشد");

		// فاکتور تنها برای سفارش‌های پرداخت‌شده صادر می‌شود
		if (order.paymentStatus !== PaymentStatus.PAID) {
			throw new BadRequestError("فاکتور تنها برای سفارش‌های پرداخت‌شده قابل صدور است");
		}

		const user = await this.userRepository.findByUserId(userId);

		const vm = this.buildViewModel(order, user);
		const html = buildOrderInvoiceHtml(vm);
		const buffer = await renderHtmlToPdf(html);

		return { buffer, fileName: `invoice-${order.orderNumber}.pdf` };
	}

	private buildViewModel(order: OrderDocument, user: any): OrderInvoiceViewModel {
		const items: InvoiceLineItem[] = [];
		let itemsGross = 0;
		let tierDiscount = 0;
		let vatAmount = 0;
		let vatRate = 0;

		let rowNo = 1;
		for (const ordered of order.orderedDocs ?? []) {
			const breakdown = ordered.breakdown;
			const itemLabel = `${ordered.translationItemTitle ?? ""} · ${ordered.languageName ?? ""}`.trim();
			const isOfficial = ordered.payload?.isOfficial !== false;

			for (const doc of breakdown?.documents ?? []) {
				items.push({
					rowNo: rowNo++,
					itemLabel,
					title: doc.title ?? "",
					details: this.buildDocDetails(doc, isOfficial),
					copyCount: doc.copyCount ?? 1,
					amount: doc.documentTotal ?? 0,
				});
				itemsGross += doc.documentTotal ?? 0;
			}

			const summary = breakdown?.summary;
			tierDiscount += summary?.tierDiscountAmount ?? 0;
			vatAmount += summary?.taxPrice ?? 0;
			vatRate = Math.max(vatRate, summary?.taxPercent ?? 0);
		}

		const couponCode =
			order.coupon && typeof order.coupon === "object" ? ((order.coupon as any).code ?? null) : null;

		return {
			invoiceTitle: "فاکتور سفارش",
			orderNumber: order.orderNumber,
			issuedAt: jalaliDateTime(new Date()),
			orderDate: jalaliDate(order.createdAt),
			isPaid: order.paymentStatus === PaymentStatus.PAID,
			company: Config.company,
			buyer: this.buildBuyer(user),
			customer: this.buildCustomer(order.customer),
			shippingAddress: this.buildShippingAddress(order.shippingAddress),
			items,
			totals: {
				itemsGross,
				tierDiscount,
				couponCode,
				couponDiscount: order.discountAmount ?? 0,
				vatRate,
				vatAmount,
				payable: order.finalAmount ?? 0,
			},
		};
	}

	/** فهرست ریزخدماتِ یک مدرک برای نمایش زیرِ ردیف فاکتور. */
	private buildDocDetails(doc: any, isOfficial: boolean): string[] {
		const details: string[] = [];
		if (!isOfficial) details.push("ترجمه غیررسمی");
		if (doc.base?.count) details.push(`نرخ پایه × ${doc.base.count}`);
		for (const sp of doc.specials ?? []) details.push(`${sp.label} × ${sp.count}`);
		if (doc.justiceCertification) details.push("مهر دادگستری");
		if (doc.mfaCertification) details.push("مهر وزارت امور خارجه");
		for (const inq of doc.justiceInquiries ?? []) details.push(inq.justiceInquiryName || "استعلام");
		for (const emb of doc.embassyApprovals ?? []) details.push(emb.embassyName || "تایید سفارت");
		if (doc.scan) details.push("اسکن مدارک");
		return details;
	}

	private buildBuyer(user: any): InvoiceParty {
		const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.username || "کاربر";
		return {
			name,
			nationalId: user?.nationalId ?? null,
			phone: user?.phoneNumber ?? user?.username ?? null,
		};
	}

	private buildCustomer(customer: any): InvoiceParty | null {
		if (!customer || typeof customer !== "object" || !customer._id) return null;
		const name = `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || "مشتری";
		const location = [customer.provinceName, customer.cityName].filter(Boolean).join(" - ");
		return {
			name,
			nationalId: customer.nationalId ?? null,
			phone: customer.phoneNumber ?? null,
			extraLines: location ? [location] : [],
		};
	}

	private buildShippingAddress(addr: any): string | null {
		if (!addr || typeof addr !== "object" || !addr._id) return null;
		const head = [addr.provinceName, addr.cityName].filter(Boolean).join(" - ");
		const parts = [head, addr.fullAddress].filter(Boolean).join("، ");
		const extra: string[] = [];
		if (addr.plaque) extra.push(`پلاک ${addr.plaque}`);
		if (addr.unit) extra.push(`واحد ${addr.unit}`);
		return [parts, extra.join("، ")].filter(Boolean).join(" — ");
	}
}

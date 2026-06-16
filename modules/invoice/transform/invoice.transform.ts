import { PaginationResult } from "../../../shared/utils/pagination.util";
import { UserDocument } from "../../user/model/user.model";
import { InvoiceDto, InvoiceUserInfo } from "../dto/invoice.dto";
import { InvoiceDocument } from "../model/invoice.model";

export default class InvoiceTransform {
	private user(user: any): InvoiceUserInfo | string | null {
		if (!user) return null;
		if (typeof user === "object" && user?._id) {
			const u = user as UserDocument;
			return {
				userId: (u._id as any)?.toString() ?? "",
				fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
				username: u.username ?? "",
				phoneNumber: u.phoneNumber ?? "",
			};
		}
		return user?.toString?.() ?? user;
	}

	invoice(doc: InvoiceDocument): InvoiceDto {
		return {
			invoiceId: (doc._id as any)?.toString() ?? "",
			invoiceNumber: doc.invoiceNumber,
			referenceType: doc.referenceType ?? null,
			referenceId: (doc.referenceId as any)?.toString?.() ?? null,
			referenceNumber: doc.referenceNumber ?? null,
			user: this.user(doc.user),
			subject: doc.subject,
			description: doc.description ?? null,
			items: (doc.items ?? []).map((it) => ({
				title: it.title,
				quantity: it.quantity,
				unitPrice: it.unitPrice,
				total: it.total,
			})),
			subtotal: doc.subtotal ?? 0,
			vatRate: doc.vatRate ?? 0,
			vatAmount: doc.vatAmount ?? 0,
			totalAmount: doc.totalAmount ?? 0,
			status: doc.status,
			issuerType: doc.issuerType,
			issuedBy: (doc.issuedBy as any)?.toString?.() ?? null,
			paymentDetail: doc.paymentDetail ?? null,
			paidAt: doc.paidAt ?? null,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	}

	invoices(docs: InvoiceDocument[]): InvoiceDto[] {
		return docs.map((d) => this.invoice(d));
	}

	paginatedInvoices(paginated: PaginationResult<InvoiceDocument>) {
		return {
			...paginated,
			elements: paginated.elements.map((item) => this.invoice(item)),
		};
	}
}

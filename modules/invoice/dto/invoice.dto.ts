import { InvoiceIssuerType, InvoiceReferenceType, InvoiceStatus } from "../model/invoice.model";

export interface InvoiceItemInput {
	title: string;
	quantity: number;
	unitPrice: number;
}

export interface CreateInvoiceDto {
	userId: string;
	subject: string;
	description?: string | null;
	items: InvoiceItemInput[];
	referenceType?: InvoiceReferenceType | null;
	referenceId?: string | null;
	referenceNumber?: number | null;
}

export interface UpdateInvoiceDto {
	subject?: string;
	description?: string | null;
	items?: InvoiceItemInput[];
}

export interface InvoiceUserInfo {
	userId: string;
	fullName: string;
	username: string;
	phoneNumber: string;
}

export interface InvoiceItemDto {
	title: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

export interface InvoiceDto {
	invoiceId: string;
	invoiceNumber: number;
	referenceType: InvoiceReferenceType | null;
	referenceId: string | null;
	referenceNumber: number | null;
	user: InvoiceUserInfo | string | null;
	subject: string;
	description: string | null;
	items: InvoiceItemDto[];
	subtotal: number;
	vatRate: number;
	vatAmount: number;
	totalAmount: number;
	status: InvoiceStatus;
	issuerType: InvoiceIssuerType;
	issuedBy: string | null;
	paymentDetail: Record<string, unknown> | null;
	paidAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

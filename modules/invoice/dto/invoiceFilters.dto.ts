import { InvoiceIssuerType, InvoiceReferenceType, InvoiceStatus } from "../model/invoice.model";

export interface InvoiceFilters {
	term?: string;
	status?: InvoiceStatus;
	referenceType?: InvoiceReferenceType;
	issuerType?: InvoiceIssuerType;
	userId?: string;
	dateFrom?: string;
	dateTo?: string;
}

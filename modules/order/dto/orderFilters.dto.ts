import { OrderStatus, PaymentStatus } from "../model/order.model";

export interface OrderFilters {
	term?: string;
	status?: OrderStatus;
	paymentStatus?: PaymentStatus;
	dateFrom?: string;
	dateTo?: string;
	userId?: string;
	customerId?: string;
	// فقط سفارش‌هایی که برای یک مشتری زیرمجموعه ثبت شده‌اند (customer ست شده) برگردانده شوند
	withCustomer?: boolean;
}

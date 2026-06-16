import { param, query } from "express-validator";
import { InvoiceStatus } from "../model/invoice.model";

// کاربر فقط صورتحساب‌های صادرشده و پرداخت‌شده را می‌بیند، پس فیلتر وضعیت هم به همین دو محدود است.
const userVisibleStatuses = [InvoiceStatus.ISSUED, InvoiceStatus.PAID];

const InvoiceValidation = {
	invoiceId: [
		param("invoiceId")
			.notEmpty()
			.withMessage("شناسه صورتحساب الزامی است")
			.isMongoId()
			.withMessage("شناسه صورتحساب معتبر نیست"),
	],

	getInvoices: [
		query("term").optional().isString().withMessage("فرمت جستجو صحیح نیست").trim(),
		query("status").optional().isIn(userVisibleStatuses).withMessage("وضعیت صورتحساب معتبر نیست"),
		query("dateFrom").optional().isISO8601().withMessage("فرمت تاریخ شروع معتبر نیست"),
		query("dateTo").optional().isISO8601().withMessage("فرمت تاریخ پایان معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],
};

export default InvoiceValidation;

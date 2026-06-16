import { body, param, query } from "express-validator";
import { InvoiceIssuerType, InvoiceReferenceType, InvoiceStatus } from "../model/invoice.model";

const createItemFields = [
	body("items").isArray({ min: 1 }).withMessage("حداقل یک ردیف برای صورتحساب الزامی است"),
	body("items.*.title")
		.notEmpty()
		.withMessage("عنوان ردیف الزامی است")
		.bail()
		.isString()
		.withMessage("عنوان ردیف باید رشته باشد")
		.isLength({ max: 200 })
		.withMessage("عنوان ردیف نباید بیشتر از ۲۰۰ کاراکتر باشد"),
	body("items.*.quantity")
		.notEmpty()
		.withMessage("تعداد الزامی است")
		.bail()
		.isInt({ min: 1 })
		.withMessage("تعداد باید عددی صحیح و حداقل ۱ باشد"),
	body("items.*.unitPrice")
		.notEmpty()
		.withMessage("مبلغ واحد الزامی است")
		.bail()
		.isFloat({ min: 0 })
		.withMessage("مبلغ واحد باید عددی غیرمنفی باشد"),
];

const InvoiceValidation = {
	invoiceId: [
		param("invoiceId")
			.notEmpty()
			.withMessage("شناسه صورتحساب الزامی است")
			.isMongoId()
			.withMessage("شناسه صورتحساب معتبر نیست"),
	],

	orderId: [
		param("orderId")
			.notEmpty()
			.withMessage("شناسه سفارش الزامی است")
			.isMongoId()
			.withMessage("شناسه سفارش معتبر نیست"),
	],

	getInvoices: [
		query("term").optional().isString().withMessage("فرمت جستجو صحیح نیست").trim(),
		query("status").optional().isIn(Object.values(InvoiceStatus)).withMessage("وضعیت صورتحساب معتبر نیست"),
		query("referenceType").optional().isIn(Object.values(InvoiceReferenceType)).withMessage("نوع مرجع معتبر نیست"),
		query("issuerType").optional().isIn(Object.values(InvoiceIssuerType)).withMessage("نوع صادرکننده معتبر نیست"),
		query("userId").optional().isMongoId().withMessage("شناسه کاربر معتبر نیست"),
		query("dateFrom").optional().isISO8601().withMessage("فرمت تاریخ شروع معتبر نیست"),
		query("dateTo").optional().isISO8601().withMessage("فرمت تاریخ پایان معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],

	createInvoice: [
		body("userId")
			.notEmpty()
			.withMessage("کاربر صورتحساب الزامی است")
			.bail()
			.isMongoId()
			.withMessage("شناسه کاربر معتبر نیست"),
		body("subject")
			.notEmpty()
			.withMessage("موضوع (بابت) صورتحساب الزامی است")
			.bail()
			.isString()
			.withMessage("موضوع باید رشته باشد")
			.isLength({ max: 200 })
			.withMessage("موضوع نباید بیشتر از ۲۰۰ کاراکتر باشد"),
		body("description")
			.optional({ nullable: true })
			.isString()
			.withMessage("توضیحات باید رشته باشد")
			.isLength({ max: 1000 })
			.withMessage("توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),
		...createItemFields,
		body("referenceType")
			.optional({ nullable: true })
			.isIn(Object.values(InvoiceReferenceType))
			.withMessage("نوع مرجع معتبر نیست"),
		body("referenceId")
			.optional({ nullable: true })
			.isMongoId()
			.withMessage("شناسه مرجع معتبر نیست")
			.custom((value, { req }) => {
				if (value && !req.body.referenceType) {
					throw new Error("برای ثبت شناسه مرجع، نوع مرجع الزامی است");
				}
				return true;
			}),
		body("referenceNumber").optional({ nullable: true }).isInt({ min: 0 }).withMessage("شماره مرجع معتبر نیست"),
	],

	updateInvoice: [
		body("subject")
			.optional()
			.isString()
			.withMessage("موضوع باید رشته باشد")
			.isLength({ max: 200 })
			.withMessage("موضوع نباید بیشتر از ۲۰۰ کاراکتر باشد"),
		body("description")
			.optional({ nullable: true })
			.isString()
			.withMessage("توضیحات باید رشته باشد")
			.isLength({ max: 1000 })
			.withMessage("توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),
		body("items").optional().isArray({ min: 1 }).withMessage("حداقل یک ردیف برای صورتحساب الزامی است"),
		body("items.*.title")
			.optional()
			.notEmpty()
			.withMessage("عنوان ردیف الزامی است")
			.bail()
			.isString()
			.withMessage("عنوان ردیف باید رشته باشد")
			.isLength({ max: 200 })
			.withMessage("عنوان ردیف نباید بیشتر از ۲۰۰ کاراکتر باشد"),
		body("items.*.quantity").optional().isInt({ min: 1 }).withMessage("تعداد باید عددی صحیح و حداقل ۱ باشد"),
		body("items.*.unitPrice").optional().isFloat({ min: 0 }).withMessage("مبلغ واحد باید عددی غیرمنفی باشد"),
	],
};

export default InvoiceValidation;

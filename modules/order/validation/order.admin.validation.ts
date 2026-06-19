import { body, param, query } from "express-validator";
import { OrderStatus, PaymentStatus } from "../model/order.model";

const AdminOrderValidation = {
	orderId: [
		param("orderId").notEmpty().withMessage("شناسه سفارش الزامی است").isMongoId().withMessage("شناسه سفارش معتبر نیست"),
	],

	getOrders: [
		query("term").optional().isString().withMessage("فرمت جستجو صحیح نیست").trim(),
		query("status")
			.optional()
			.isIn(Object.values(OrderStatus))
			.withMessage("وضعیت سفارش معتبر نیست"),
		query("paymentStatus").optional().isIn(Object.values(PaymentStatus)).withMessage("وضعیت پرداخت معتبر نیست"),
		query("dateFrom").optional().isISO8601().withMessage("فرمت تاریخ شروع معتبر نیست"),
		query("dateTo").optional().isISO8601().withMessage("فرمت تاریخ پایان معتبر نیست"),
		query("userId").optional().isMongoId().withMessage("شناسه کاربر معتبر نیست"),
		query("customerId").optional().isMongoId().withMessage("شناسه مشتری معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],

	updateDocumentScanAssets: [
		param("orderId").notEmpty().withMessage("شناسه سفارش الزامی است").isMongoId().withMessage("شناسه سفارش معتبر نیست"),
		param("cartItemId").notEmpty().withMessage("شناسه آیتم الزامی است").isString(),
		param("documentKey").notEmpty().withMessage("کلید مدرک الزامی است").isString(),
		body("scanAssets").isArray().withMessage("scanAssets باید آرایه باشد"),
		body("scanAssets.*").isURL().withMessage("هر آیتم scanAssets باید URL معتبر باشد"),
	],

	updateOrderItemOfficial: [
		param("orderId").notEmpty().withMessage("شناسه سفارش الزامی است").isMongoId().withMessage("شناسه سفارش معتبر نیست"),
		param("cartItemId").notEmpty().withMessage("شناسه آیتم الزامی است").isString(),
		body("isOfficial").isBoolean().withMessage("isOfficial باید boolean باشد"),
	],

	updateOrderStatus: [
		param("orderId").notEmpty().withMessage("شناسه سفارش الزامی است").isMongoId().withMessage("شناسه سفارش معتبر نیست"),
		body("status")
			.notEmpty()
			.withMessage("وضعیت سفارش الزامی است")
			.bail()
			.isIn(Object.values(OrderStatus))
			.withMessage("وضعیت سفارش معتبر نیست"),
		body("rejectedRemarks")
			.optional({ nullable: true })
			.isString()
			.withMessage("توضیحات رد سفارش باید رشته باشد")
			.isLength({ max: 1000 })
			.withMessage("توضیحات رد سفارش نباید بیشتر از ۱۰۰۰ کاراکتر باشد")
			.custom((value, { req }) => {
				if (req.body.status === OrderStatus.NEEDS_EDITING && (!value || !value.trim())) {
					throw new Error("برای ارجاع سفارش جهت ویرایش، وارد کردن دلیل الزامی است");
				}
				return true;
			}),
	],
};

export default AdminOrderValidation;

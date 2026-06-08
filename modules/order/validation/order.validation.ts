import { body, param, query } from "express-validator";
import RateCalculatorValidation from "../../rateCalculator/validation/rateCalculator.validation";
import { OrderStatus, PaymentStatus } from "../model/order.model";

const OrderValidation = {
	orderId: [
		param("orderId").notEmpty().withMessage("شناسه سفارش الزامی است").isMongoId().withMessage("شناسه سفارش معتبر نیست"),
	],

	createOrder: [
		body("shippingAddressId")
			.notEmpty()
			.withMessage("انتخاب آدرس الزامی است")
			.isMongoId()
			.withMessage("شناسه آدرس معتبر نیست"),
		body("remarks").optional({ nullable: true }).isString().withMessage("توضیحات باید رشته باشد")
			.isLength({ max: 1000 }).withMessage("توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),
	],

	getOrders: [
		query("status")
			.optional()
			.isIn(Object.values(OrderStatus))
			.withMessage("وضعیت سفارش معتبر نیست"),
		query("paymentStatus").optional().isIn(Object.values(PaymentStatus)).withMessage("وضعیت پرداخت معتبر نیست"),
		query("customerId").optional().isMongoId().withMessage("شناسه مشتری معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],

	updateOrderItem: [
		param("orderId").notEmpty().withMessage("شناسه سفارش الزامی است").isMongoId().withMessage("شناسه سفارش معتبر نیست"),
		param("cartItemId").notEmpty().withMessage("شناسه آیتم الزامی است").isString().withMessage("شناسه آیتم معتبر نیست"),
		...RateCalculatorValidation.calculate,
		body("passports").optional({ nullable: true }).isArray().withMessage("لیست پاسپورت‌ها باید آرایه باشد"),
		body("passports.*").optional().isString().withMessage("شناسه پاسپورت معتبر نیست"),
		body("assets").optional({ nullable: true }).isArray().withMessage("لیست فایل‌ها باید آرایه باشد"),
		body("assets.*").optional().isString().withMessage("شناسه فایل معتبر نیست"),
	],
};

export default OrderValidation;

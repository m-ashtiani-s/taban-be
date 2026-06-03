import { body, param } from "express-validator";
import RateCalculatorValidation from "../../rateCalculator/validation/rateCalculator.validation";

const CartValidation = {
	addDocumentToCart: [
		...RateCalculatorValidation.calculate,
		body("passports").optional({ nullable: true }).isArray().withMessage("لیست پاسپورت‌ها باید آرایه باشد"),
		body("passports.*").optional().isString().withMessage("شناسه پاسپورت معتبر نیست"),
		body("assets").optional({ nullable: true }).isArray().withMessage("لیست فایل‌ها باید آرایه باشد"),
		body("assets.*").optional().isString().withMessage("شناسه فایل معتبر نیست"),
		body("customerId").optional({ nullable: true }).isMongoId().withMessage("شناسه مشتری معتبر نیست"),
	],
	removeDocumentFromCart: [
		param("cartItemId")
			.notEmpty()
			.withMessage("شناسه آیتم سبد خرید الزامی است")
			.isString()
			.withMessage("شناسه آیتم سبد خرید معتبر نیست"),
	],
	updateDocumentInCart: [
		param("cartItemId")
			.notEmpty()
			.withMessage("شناسه آیتم سبد خرید الزامی است")
			.isString()
			.withMessage("شناسه آیتم سبد خرید معتبر نیست"),
		...RateCalculatorValidation.calculate,
		body("passports").optional({ nullable: true }).isArray().withMessage("لیست پاسپورت‌ها باید آرایه باشد"),
		body("passports.*").optional().isString().withMessage("شناسه پاسپورت معتبر نیست"),
		body("assets").optional({ nullable: true }).isArray().withMessage("لیست فایل‌ها باید آرایه باشد"),
		body("assets.*").optional().isString().withMessage("شناسه فایل معتبر نیست"),
		body("customerId").optional({ nullable: true }).isMongoId().withMessage("شناسه مشتری معتبر نیست"),
	],
	applyCouponToCart: [
		body("couponCode")
			.notEmpty()
			.withMessage("کد تخفیف الزامی است")
			.bail()
			.isString()
			.withMessage("کد تخفیف باید رشته باشد")
			.bail()
			.isLength({ min: 3, max: 30 })
			.withMessage("کد تخفیف باید بین ۳ تا ۳۰ کاراکتر باشد"),
	],
};

export default CartValidation;

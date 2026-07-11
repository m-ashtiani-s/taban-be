import { body } from "express-validator";

const PaymentValidation = {
	initiate: [
		body("orderId").notEmpty().withMessage("شناسه سفارش الزامی است").bail().isMongoId().withMessage("شناسه سفارش معتبر نیست"),
		body("backUrl")
			.optional({ nullable: true })
			.isURL({ protocols: ["http", "https"], require_protocol: true, require_tld: false })
			.withMessage("آدرس بازگشت معتبر نیست"),
	],
};

export default PaymentValidation;

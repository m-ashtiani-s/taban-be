import { body, ValidationChain } from "express-validator";

const scoreField = (name: string, label: string): ValidationChain =>
	body(name)
		.notEmpty()
		.withMessage(`${label} الزامی است`)
		.bail()
		.isInt({ min: 0 })
		.withMessage(`${label} باید عددی صحیح و غیرمنفی باشد`);

const discountField = (name: string, label: string): ValidationChain =>
	body(name)
		.notEmpty()
		.withMessage(`${label} الزامی است`)
		.bail()
		.isInt({ min: 0, max: 100 })
		.withMessage(`${label} باید عددی بین ۰ تا ۱۰۰ باشد`);

const ClubValidation = {
	updateConfig: [
		scoreField("bronzeMinScore", "آستانه‌ی امتیاز برنزی"),
		scoreField("silverMinScore", "آستانه‌ی امتیاز نقره‌ای"),
		scoreField("goldMinScore", "آستانه‌ی امتیاز طلایی"),
		discountField("bronzeDiscount", "درصد تخفیف برنزی"),
		discountField("silverDiscount", "درصد تخفیف نقره‌ای"),
		discountField("goldDiscount", "درصد تخفیف طلایی"),
	],
};

export default ClubValidation;

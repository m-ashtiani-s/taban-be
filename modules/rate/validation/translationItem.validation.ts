import { body, check, query } from "express-validator";

const RateValidation = {
	createTranslationItem: [
		body("username").notEmpty().withMessage("وارد کردن شماره تماس الزامی است"),
		body("otp").notEmpty().withMessage("وارد کردن کد تایید الزامی است").isLength({ min: 4, max: 6 }).withMessage("کد تایید باید بین ۴ تا ۶ رقم باشد"),
	],
};

export default RateValidation;

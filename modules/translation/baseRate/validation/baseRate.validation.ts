import { body, check, query } from "express-validator";

const BaseRateValidation = {
	createBaseRate: [
		body("translationItemId").notEmpty().withMessage("وارد کردن مدرک الزامی است").isMongoId().withMessage("شناسه مدرک معتبر نیست"),
		body("languageId").notEmpty().withMessage("وارد کردن زبان الزامی است").isMongoId().withMessage("شناسه زبان معتبر نیست"),
		body("basePrice").notEmpty().withMessage("وارد کردن کد نرخ پایه الزامی است").isNumeric().withMessage("نرخ پایه باید عدد باشد"),
	],
};

export default BaseRateValidation;

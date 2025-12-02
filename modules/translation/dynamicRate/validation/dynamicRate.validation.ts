import { body } from "express-validator";

export const DynaminRateValidation = {
	createDynamicRate: [
		body("translationItemId").notEmpty().withMessage("وارد کردن مدرک الزامی است").isMongoId().withMessage("شناسه مدرک معتبر نیست"),
		body("languageId").notEmpty().withMessage("وارد کردن زبان الزامی است").isMongoId().withMessage("شناسه زبان معتبر نیست"),
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد"),
		body("label").notEmpty().withMessage("وارد کردن عنوان الزامی است").isString().withMessage("عنوان باید رشته باشد"),
	],
	updateDynamicRatePrice: [body("price").notEmpty().withMessage("وارد کردن نرخ خاص الزامی است").isNumeric().withMessage("نرخ خاص باید عدد باشد")],
	updateDynamicRate: [
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد"),
		body("label").notEmpty().withMessage("وارد کردن عنوان الزامی است").isString().withMessage("عنوان باید رشته باشد"),
	],
};

import { body } from "express-validator";

export const EmbassyRateValidation = {
	createEmbassyRate: [
		body("translationItemId").notEmpty().withMessage("وارد کردن مدرک الزامی است").isMongoId().withMessage("شناسه مدرک معتبر نیست"),
		body("embassyId").notEmpty().withMessage("وارد کردن سفارت الزامی است").isMongoId().withMessage("شناسه سفارت معتبر نیست"),
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد"),
	],
	updateEmbassyRatePrice: [
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد")
	],
};

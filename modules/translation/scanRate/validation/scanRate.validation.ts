import { body } from "express-validator";

export const ScanRateValidation = {
	createScanRate: [
		body("translationItemId").notEmpty().withMessage("وارد کردن مدرک الزامی است").isMongoId().withMessage("شناسه مدرک معتبر نیست"),
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد"),
	],
	updateScanRatePrice: [
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد"),
	],
};

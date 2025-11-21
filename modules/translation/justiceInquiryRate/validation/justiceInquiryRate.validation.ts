import { body } from "express-validator";

export const JusticeInquiryRateValidation = {
	createJusticeInquiryRate: [
		body("translationItemId").notEmpty().withMessage("وارد کردن مدرک الزامی است").isMongoId().withMessage("شناسه مدرک معتبر نیست"),
		body("languageId").notEmpty().withMessage("وارد کردن زبان الزامی است").isMongoId().withMessage("شناسه زبان معتبر نیست"),
		body("justiceInquiryId").notEmpty().withMessage("وارد کردن استعلام الزامی است").isMongoId().withMessage("شناسه استعلام معتبر نیست"),
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد"),
	],
	updateJusticeInquiryRatePrice: [
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد")
	],
};

import { body, check, query } from "express-validator";

const BaseRateValidation = {
	createBaseRate: [
		body("translationItemId").notEmpty().withMessage("وارد کردن مدرک الزامی است").isMongoId().withMessage("شناسه مدرک معتبر نیست"),
		body("languageId").notEmpty().withMessage("وارد کردن زبان الزامی است").isMongoId().withMessage("شناسه زبان معتبر نیست"),
		body("basePrice").notEmpty().withMessage("وارد کردن کد نرخ پایه الزامی است").isNumeric().withMessage("نرخ پایه باید عدد باشد"),
		body("sanamPrice").notEmpty().withMessage("وارد کردن نرخ سنام پایه الزامی است").isNumeric().withMessage("نرخ سنام باید عدد باشد"),
		body("daftariPrice").notEmpty().withMessage("وارد کردن نرخ دفتری پایه الزامی است").isNumeric().withMessage("نرخ دفتری باید عدد باشد"),
		body("tasdighPrice").notEmpty().withMessage("وارد کردن نرخ تصدیق پایه الزامی است").isNumeric().withMessage("نرخ تصدیق باید عدد باشد"),
		body("mohrPrice").notEmpty().withMessage("وارد کردن نرخ مهر مترجم پایه الزامی است").isNumeric().withMessage("نرخ مهر مترجم باید عدد باشد"),
	],
	updateBaseRatePrice: [
		body("basePrice").notEmpty().withMessage("وارد کردن نرخ پایه الزامی است").isNumeric().withMessage("نرخ پایه باید عدد باشد"),
		body("sanamPrice").notEmpty().withMessage("وارد کردن نرخ سنام پایه الزامی است").isNumeric().withMessage("نرخ سنام باید عدد باشد"),
		body("daftariPrice").notEmpty().withMessage("وارد کردن نرخ دفتری پایه الزامی است").isNumeric().withMessage("نرخ دفتری باید عدد باشد"),
		body("tasdighPrice").notEmpty().withMessage("وارد کردن نرخ تصدیق پایه الزامی است").isNumeric().withMessage("نرخ تصدیق باید عدد باشد"),
		body("mohrPrice").notEmpty().withMessage("وارد کردن نرخ مهر مترجم پایه الزامی است").isNumeric().withMessage("نرخ مهر مترجم باید عدد باشد"),
	],
};

export default BaseRateValidation;

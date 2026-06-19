import { body, param } from "express-validator";

const TranslationValidation = {
	translationItemId: [
		param("translationItemId")
			.notEmpty()
			.withMessage("شناسه مدرک الزامی است")
			.isMongoId()
			.withMessage("شناسه مدرک معتبر نیست"),
	],
	createTranslationItem: [
		body("title").notEmpty().withMessage("وارد کردن عنوان مدرک الزامی است"),
		body("documentType").notEmpty().withMessage("وارد کردن نوع مدرک الزامی است"),
		body("categoryId").notEmpty().withMessage("وارد کردن دسته مدرک الزامی است").bail().isMongoId().withMessage("شناسه دسته مدرک معتبر نیست"),
		body("scoreMultiplier").optional({ nullable: true }).isFloat({ min: 0 }).withMessage("ضریب امتیاز باید عددی غیرمنفی باشد"),
	],
	updateTranslationItem: [
		body("title").notEmpty().withMessage("وارد کردن عنوان مدرک الزامی است"),
		body("documentType").notEmpty().withMessage("وارد کردن نوع مدرک الزامی است"),
		body("isActive").notEmpty().withMessage("وارد کردن وضعیت الزامی است"),
		body("categoryId").notEmpty().withMessage("وارد کردن دسته مدرک الزامی است").bail().isMongoId().withMessage("شناسه دسته مدرک معتبر نیست"),
		body("scoreMultiplier").optional({ nullable: true }).isFloat({ min: 0 }).withMessage("ضریب امتیاز باید عددی غیرمنفی باشد"),
	],
};

export default TranslationValidation;

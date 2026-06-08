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
	],
	updateTranslationItem: [
		body("title").notEmpty().withMessage("وارد کردن عنوان مدرک الزامی است"),
		body("documentType").notEmpty().withMessage("وارد کردن نوع مدرک الزامی است"),
		body("isActive").notEmpty().withMessage("وارد کردن وضعیت الزامی است"),
		body("categoryId").notEmpty().withMessage("وارد کردن دسته مدرک الزامی است").bail().isMongoId().withMessage("شناسه دسته مدرک معتبر نیست"),
	],
};

export default TranslationValidation;

import { body, param } from "express-validator";

const TranslationItemCategoryValidation = {
	translationItemCategoryId: [
		param("translationItemCategoryId")
			.notEmpty()
			.withMessage("شناسه دسته‌بندی الزامی است")
			.isMongoId()
			.withMessage("شناسه دسته‌بندی معتبر نیست"),
	],
	createTranslationItemCategory: [
		body("title").notEmpty().withMessage("وارد کردن عنوان دسته‌بندی الزامی است"),
	],
	updateTranslationItemCategory: [
		body("title").notEmpty().withMessage("وارد کردن عنوان دسته‌بندی الزامی است"),
	],
};

export default TranslationItemCategoryValidation;

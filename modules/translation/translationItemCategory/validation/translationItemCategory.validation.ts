import { body, check, query } from "express-validator";

const TranslationItemCategoryValidation = {
	createTranslationItemCategory: [
		body("title").notEmpty().withMessage("وارد کردن عنوان دسته‌بندی الزامی است"),
	],
	updateTranslationItemCategory: [
		body("title").notEmpty().withMessage("وارد کردن عنوان دسته‌بندی الزامی است"),
	],
};

export default TranslationItemCategoryValidation;

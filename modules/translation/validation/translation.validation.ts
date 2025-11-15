import { body, check, query } from "express-validator";

const TranslationValidation = {
	createTranslationItem: [
		body("title").notEmpty().withMessage("وارد کردن عنوان مدرک الزامی است"),
		body("documentType").notEmpty().withMessage("وارد کردن نوع مدرک الزامی است"),
	],
};

export default TranslationValidation;

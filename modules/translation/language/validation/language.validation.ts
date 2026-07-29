import { body, param } from "express-validator";

const LanguageValidation = {
	languageId: [
		param("languageId")
			.notEmpty()
			.withMessage("شناسه زبان الزامی است")
			.isMongoId()
			.withMessage("شناسه زبان معتبر نیست"),
	],
	createLanguage: [
		body("languageName").notEmpty().withMessage("وارد کردن ربان الزامی است"),
		body("languageCode").notEmpty().withMessage("وارد کردن کد زبان الزامی است"),
	],
	updateLanguage: [
		body("languageName").notEmpty().withMessage("وارد کردن ربان الزامی است"),
		body("languageCode").notEmpty().withMessage("وارد کردن کد زبان الزامی است"),
		body("isActive").notEmpty().withMessage("وارد کردن وضعیت الزامی است"),
	],
	reorderLanguages: [
		body("orders").isArray({ min: 1 }).withMessage("لیست ترتیب زبان‌ها الزامی است"),
		body("orders.*.languageId").notEmpty().withMessage("شناسه زبان الزامی است").isMongoId().withMessage("شناسه زبان معتبر نیست"),
		body("orders.*.order").isInt({ min: 0 }).withMessage("ترتیب زبان معتبر نیست"),
	],
};

export default LanguageValidation;

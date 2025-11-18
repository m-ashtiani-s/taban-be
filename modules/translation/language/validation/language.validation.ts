import { body, check, query } from "express-validator";

const LanguageValidation = {
	createLanguage: [
		body("languageName").notEmpty().withMessage("وارد کردن ربان الزامی است"),
		body("languageCode").notEmpty().withMessage("وارد کردن کد زبان الزامی است"),
	],
};

export default LanguageValidation;

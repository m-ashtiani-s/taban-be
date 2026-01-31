import { body, check, query } from "express-validator";

const EmbassyValidation = {
	createEmbassy: [
		body("title").notEmpty().withMessage("وارد کردن عنوان سفارت الزامی است")
	],
	updateEmbassy: [
		body("title").notEmpty().withMessage("وارد کردن عنوان سفارت الزامی است"),
		body("isActive").notEmpty().withMessage("وارد کردن وضعیت الزامی است"),
	],
};

export default EmbassyValidation;

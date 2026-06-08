import { body, param } from "express-validator";

const EmbassyValidation = {
	embassyId: [
		param("embassyId")
			.notEmpty()
			.withMessage("شناسه سفارت الزامی است")
			.isMongoId()
			.withMessage("شناسه سفارت معتبر نیست"),
	],
	createEmbassy: [
		body("title").notEmpty().withMessage("وارد کردن عنوان سفارت الزامی است")
	],
	updateEmbassy: [
		body("title").notEmpty().withMessage("وارد کردن عنوان سفارت الزامی است"),
		body("isActive").notEmpty().withMessage("وارد کردن وضعیت الزامی است"),
	],
};

export default EmbassyValidation;

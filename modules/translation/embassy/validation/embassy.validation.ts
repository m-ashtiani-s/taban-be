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
	reorderEmbassies: [
		body("orders").isArray({ min: 1 }).withMessage("لیست ترتیب سفارت‌ها الزامی است"),
		body("orders.*.embassyId").notEmpty().withMessage("شناسه سفارت الزامی است").isMongoId().withMessage("شناسه سفارت معتبر نیست"),
		body("orders.*.order").isInt({ min: 0 }).withMessage("ترتیب سفارت معتبر نیست"),
	],
	updateEmbassy: [
		body("title").notEmpty().withMessage("وارد کردن عنوان سفارت الزامی است"),
		body("isActive").notEmpty().withMessage("وارد کردن وضعیت الزامی است"),
	],
};

export default EmbassyValidation;

import { body, param, query } from "express-validator";

const passportBodyFields = [
	body("title")
		.notEmpty()
		.withMessage("عنوان پاسپورت الزامی است")
		.bail()
		.isString()
		.withMessage("عنوان پاسپورت باید رشته باشد")
		.isLength({ max: 100 })
		.withMessage("عنوان پاسپورت نباید بیشتر از ۱۰۰ کاراکتر باشد"),

	body("image")
		.notEmpty()
		.withMessage("تصویر پاسپورت الزامی است")
		.bail()
		.isString()
		.withMessage("تصویر پاسپورت معتبر نیست"),

	body("isActive").optional().isBoolean().withMessage("مقدار فعال/غیرفعال معتبر نیست"),
];

const PassportValidation = {
	passportId: [
		param("passportId")
			.notEmpty()
			.withMessage("شناسه پاسپورت الزامی است")
			.isMongoId()
			.withMessage("شناسه پاسپورت معتبر نیست"),
	],

	getPassports: [
		query("term").optional().isString().withMessage("فرمت جستجو صحیح نیست").trim(),
		query("isActive").optional().isBoolean({ strict: false }).withMessage("مقدار وضعیت معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],

	createPassport: passportBodyFields,
};

export default PassportValidation;

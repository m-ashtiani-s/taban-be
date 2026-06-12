import { param, query } from "express-validator";

const AdminPassportValidation = {
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
		query("userId").optional().isMongoId().withMessage("شناسه کاربر معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],
};

export default AdminPassportValidation;

import { body } from "express-validator";

export const DynaminRateValidation = {
	createDynamicRate: [
		body("translationItemId").notEmpty().withMessage("وارد کردن مدرک الزامی است").isMongoId().withMessage("شناسه مدرک معتبر نیست"),
		body("languageId").notEmpty().withMessage("وارد کردن زبان الزامی است").isMongoId().withMessage("شناسه زبان معتبر نیست"),
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد"),
		body("label").notEmpty().withMessage("وارد کردن عنوان الزامی است").isString().withMessage("عنوان باید رشته باشد"),
		body("inputType")
			.notEmpty()
			.withMessage("وارد کردن نوع ورودی الزامی است")
			.isIn(["NUMBER", "CHECKBOX", "SELECT"])
			.withMessage("نوع ورودی معتبر نیست"),
		body("options").notEmpty().withMessage("وارد کردن لیست گزینه الزامی است").isArray().withMessage("آپشن‌ها باید آرایه باشند"),
		body("options.*.label").if(body("options").exists()).notEmpty().withMessage("برچسب هر گزینه الزامی است"),
		body("options.*.price").if(body("options").exists()).isNumeric().withMessage("قیمت هر گزینه باید عدد باشد"),
	],
	updateDynamicRatePrice: [body("price").notEmpty().withMessage("وارد کردن نرخ خاص الزامی است").isNumeric().withMessage("نرخ خاص باید عدد باشد")],
	updateDynamicRate: [
		body("price").notEmpty().withMessage("وارد کردن نرخ الزامی است").isNumeric().withMessage("نرخ باید عدد باشد"),
		body("label").notEmpty().withMessage("وارد کردن عنوان الزامی است").isString().withMessage("عنوان باید رشته باشد"),
		body("inputType")
			.notEmpty()
			.withMessage("وارد کردن نوع ورودی الزامی است")
			.isIn(["NUMBER", "CHECKBOX", "SELECT"])
			.withMessage("نوع ورودی معتبر نیست"),
		body("options").notEmpty().withMessage("وارد کردن لیست گزینه الزامی است").isArray().withMessage("آپشن‌ها باید آرایه باشند"),
		body("options.*.label").if(body("options").exists()).notEmpty().withMessage("برچسب هر گزینه الزامی است"),
		body("options.*.price").if(body("options").exists()).isNumeric().withMessage("قیمت هر گزینه باید عدد باشد"),
	],
};

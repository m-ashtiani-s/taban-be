import { body, param, query } from "express-validator";

const shippingAddressBodyFields = [
	body("title")
		.notEmpty()
		.withMessage("عنوان آدرس الزامی است")
		.bail()
		.isString()
		.withMessage("عنوان آدرس باید رشته باشد")
		.isLength({ max: 100 })
		.withMessage("عنوان آدرس نباید بیشتر از ۱۰۰ کاراکتر باشد"),

	body("provinceName")
		.notEmpty()
		.withMessage("نام استان الزامی است")
		.bail()
		.isString()
		.withMessage("نام استان باید رشته باشد"),

	body("provinceCode")
		.notEmpty()
		.withMessage("کد استان الزامی است")
		.bail()
		.isInt({ min: 0 })
		.withMessage("کد استان معتبر نیست"),

	body("cityName")
		.notEmpty()
		.withMessage("نام شهر الزامی است")
		.bail()
		.isString()
		.withMessage("نام شهر باید رشته باشد"),

	body("cityCode")
		.notEmpty()
		.withMessage("کد شهر الزامی است")
		.bail()
		.isInt({ min: 0 })
		.withMessage("کد شهر معتبر نیست"),

	body("plaque")
		.optional({ nullable: true })
		.isString()
		.withMessage("پلاک باید رشته باشد")
		.isLength({ max: 20 })
		.withMessage("پلاک نباید بیشتر از ۲۰ کاراکتر باشد"),

	body("unit")
		.optional({ nullable: true })
		.isString()
		.withMessage("واحد باید رشته باشد")
		.isLength({ max: 20 })
		.withMessage("واحد نباید بیشتر از ۲۰ کاراکتر باشد"),

	body("fullAddress")
		.notEmpty()
		.withMessage("آدرس کامل الزامی است")
		.bail()
		.isString()
		.withMessage("آدرس کامل باید رشته باشد")
		.isLength({ max: 1000 })
		.withMessage("آدرس کامل نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),

	body("addressDescription")
		.optional({ nullable: true })
		.isString()
		.withMessage("توضیحات آدرس باید رشته باشد")
		.isLength({ max: 1000 })
		.withMessage("توضیحات آدرس نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),

	body("landlineNumber")
		.optional({ nullable: true })
		.isString()
		.withMessage("شماره ثابت باید رشته باشد")
		.isLength({ max: 20 })
		.withMessage("شماره ثابت معتبر نیست"),

	body("isActive").optional().isBoolean().withMessage("مقدار فعال/غیرفعال معتبر نیست"),
];

const ShippingAddressValidation = {
	shippingAddressId: [
		param("shippingAddressId")
			.notEmpty()
			.withMessage("شناسه آدرس الزامی است")
			.isMongoId()
			.withMessage("شناسه آدرس معتبر نیست"),
	],

	getShippingAddresses: [
		query("term").optional().isString().withMessage("فرمت جستجو صحیح نیست").trim(),
		query("provinceCode").optional().isInt({ min: 0 }).withMessage("کد استان معتبر نیست"),
		query("cityCode").optional().isInt({ min: 0 }).withMessage("کد شهر معتبر نیست"),
		query("isActive").optional().isBoolean({ strict: false }).withMessage("مقدار وضعیت معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],

	createShippingAddress: shippingAddressBodyFields,

	updateShippingAddress: shippingAddressBodyFields,
};

export default ShippingAddressValidation;

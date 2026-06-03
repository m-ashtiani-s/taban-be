import { body, param, query } from "express-validator";

const customerBodyFields = [
	body("firstName")
		.notEmpty()
		.withMessage("نام مشتری الزامی است")
		.bail()
		.isString()
		.withMessage("نام مشتری باید رشته باشد")
		.isLength({ max: 100 })
		.withMessage("نام مشتری نباید بیشتر از ۱۰۰ کاراکتر باشد"),
	body("lastName")
		.notEmpty()
		.withMessage("نام خانوادگی مشتری الزامی است")
		.bail()
		.isString()
		.withMessage("نام خانوادگی مشتری باید رشته باشد")
		.isLength({ max: 100 })
		.withMessage("نام خانوادگی مشتری نباید بیشتر از ۱۰۰ کاراکتر باشد"),
	body("nationalId")
		.notEmpty()
		.withMessage("کد ملی الزامی است")
		.bail()
		.matches(/^\d{10}$/)
		.withMessage("کد ملی باید ۱۰ رقم عددی باشد"),
	body("phoneNumber")
		.notEmpty()
		.withMessage("شماره تماس الزامی است")
		.bail()
		.matches(/^09\d{9}$/)
		.withMessage("شماره تماس باید با ۰۹ شروع شده و ۱۱ رقم باشد"),
	body("provinceName").notEmpty().withMessage("نام استان الزامی است").bail().isString().withMessage("نام استان باید رشته باشد"),
	body("provinceCode").notEmpty().withMessage("کد استان الزامی است").bail().isInt({ min: 0 }).withMessage("کد استان معتبر نیست"),
	body("cityName").notEmpty().withMessage("نام شهر الزامی است").bail().isString().withMessage("نام شهر باید رشته باشد"),
	body("cityCode").notEmpty().withMessage("کد شهر الزامی است").bail().isInt({ min: 0 }).withMessage("کد شهر معتبر نیست"),
	body("isActive").optional().isBoolean().withMessage("مقدار فعال/غیرفعال معتبر نیست"),
];

const AdminCustomerValidation = {
	customerId: [
		param("customerId").notEmpty().withMessage("شناسه مشتری الزامی است").isMongoId().withMessage("شناسه مشتری معتبر نیست"),
	],

	getCustomers: [
		query("term").optional().isString().withMessage("فرمت جستجو صحیح نیست").trim(),
		query("enterpriseId").optional().isMongoId().withMessage("شناسه کاربر سازمانی معتبر نیست"),
		query("provinceCode").optional().isInt({ min: 0 }).withMessage("کد استان معتبر نیست"),
		query("cityCode").optional().isInt({ min: 0 }).withMessage("کد شهر معتبر نیست"),
		query("isActive").optional().isBoolean({ strict: false }).withMessage("مقدار وضعیت معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],

	updateCustomer: customerBodyFields,
};

export default AdminCustomerValidation;

import { body, param, query } from "express-validator";

const AdminUserValidation = {
	userId: [
		param("userId")
			.notEmpty()
			.withMessage("شناسه کاربر الزامی است")
			.bail()
			.isMongoId()
			.withMessage("شناسه کاربر معتبر نیست"),
	],

	getUsers: [
		query("term").optional().isString().withMessage("فرمت جستجو صحیح نیست").trim(),
		query("customerType")
			.optional()
			.isIn(["NORMAL", "ENTERPRISE"])
			.withMessage("نوع مشتری معتبر نیست"),
		query("userType")
			.optional()
			.isIn(["individual", "legal"])
			.withMessage("نوع کاربر معتبر نیست"),
		query("isActive").optional().isIn(["true", "false"]).withMessage("وضعیت معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],

	updateUser: [
		body("firstName")
			.optional({ nullable: true })
			.isString()
			.withMessage("نام باید رشته باشد")
			.bail()
			.isLength({ max: 100 })
			.withMessage("طول نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد"),
		body("lastName")
			.optional({ nullable: true })
			.isString()
			.withMessage("نام خانوادگی باید رشته باشد")
			.bail()
			.isLength({ max: 100 })
			.withMessage("طول نام خانوادگی نمی‌تواند بیش از ۱۰۰ کاراکتر باشد"),
		body("profilePic")
			.optional({ nullable: true })
			.isString()
			.withMessage("تصویر پروفایل معتبر نیست"),
		body("nationalId")
			.optional({ nullable: true })
			.isString()
			.withMessage("کد ملی باید رشته باشد")
			.bail()
			.custom((value) => {
				if (!value) return true;
				if (!/^\d{10}$/.test(value)) {
					throw new Error("کد ملی باید ۱۰ رقم عددی باشد");
				}
				return true;
			}),
		body("phoneNumber")
			.optional({ nullable: true })
			.isString()
			.withMessage("شماره تماس باید رشته باشد")
			.bail()
			.custom((value) => {
				if (!value) return true;
				if (!/^09\d{9}$/.test(value)) {
					throw new Error("شماره تماس باید با ۰۹ شروع شده و ۱۱ رقم باشد");
				}
				return true;
			}),
		body("userType")
			.optional({ nullable: true })
			.isIn(["individual", "legal"])
			.withMessage("نوع کاربری معتبر نیست"),
		body("customerType")
			.optional({ nullable: true })
			.isIn(["NORMAL", "ENTERPRISE"])
			.withMessage("نوع مشتری معتبر نیست"),
		body("requiredLanguages")
			.optional({ nullable: true })
			.isArray()
			.withMessage("زبان‌های مورد نیاز باید آرایه باشد"),
		body("requiredLanguages.*")
			.optional()
			.isMongoId()
			.withMessage("شناسه زبان معتبر نیست"),
		body("specialtyField")
			.optional({ nullable: true })
			.isString()
			.withMessage("حوزه تخصصی باید رشته باشد")
			.bail()
			.isLength({ max: 200 })
			.withMessage("طول حوزه تخصصی نمی‌تواند بیش از ۲۰۰ کاراکتر باشد"),
		body("referralSource")
			.optional({ nullable: true })
			.isString()
			.withMessage("نحوه آشنایی معتبر نیست"),
		body("isActive")
			.optional({ nullable: true })
			.isBoolean()
			.withMessage("وضعیت فعال‌سازی معتبر نیست"),
	],
};

export default AdminUserValidation;

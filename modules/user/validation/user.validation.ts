import { body } from "express-validator";
import { UserType } from "../model/user.model";

const UserValidation = {
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
			.isIn(Object.values(UserType))
			.withMessage("نوع کاربری معتبر نیست"),

		body("requiredLanguages")
			.optional({ nullable: true })
			.isArray()
			.withMessage("زبان‌های مورد نیاز باید آرایه باشد"),

		body("requiredLanguages.*")
			.optional()
			.isString()
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

		body("referralCode")
			.optional({ nullable: true })
			.isString()
			.withMessage("کد معرف معتبر نیست")
			.bail()
			.isLength({ max: 40 })
			.withMessage("طول کد معرف نمی‌تواند بیش از ۴۰ کاراکتر باشد"),
	],
};

export default UserValidation;

import { body, check, query } from "express-validator";

const AuthValidation = {
	checkUsername: [query("username").notEmpty().withMessage("وارد کردن شماره تماس الزامی است")],
	sendOTP: [body("username").notEmpty().withMessage("وارد کردن شماره تماس الزامی است")],
	checkOTP: [
		body("username").notEmpty().withMessage("وارد کردن شماره تماس الزامی است"),
		body("otp")
			.notEmpty()
			.withMessage("وارد کردن کد تایید الزامی است")
			.isLength({ min: 4, max: 6 })
			.withMessage("کد تایید باید بین ۴ تا ۶ رقم باشد"),
	],
	setPassword: [
		body("username").notEmpty().withMessage("وارد کردن شماره تماس الزامی است"),
		body("password")
			.notEmpty()
			.withMessage("رمز عبور الزامی است")
			.isLength({ min: 6 })
			.withMessage("رمز عبور باید حداقل ۶ کاراکتر باشد")
			.matches(/[a-zA-Z]/)
			.withMessage("رمز عبور باید شامل حروف انگلیسی باشد"),
		body("referralCode")
			.optional({ nullable: true })
			.isString()
			.withMessage("کد معرف معتبر نیست")
			.bail()
			.isLength({ max: 40 })
			.withMessage("طول کد معرف نمی‌تواند بیش از ۴۰ کاراکتر باشد"),
	],
	login: [body("username").notEmpty().withMessage("نام کاربری الزامی است"), body("password").notEmpty().withMessage("رمز عبور الزامی است")],
};

export default AuthValidation;

import { body } from "express-validator";

const EnterpriseCustomerValidation = {
	register: [
		body("institutionName")
			.notEmpty()
			.withMessage("نام موسسه الزامی است")
			.bail()
			.isString()
			.withMessage("نام موسسه باید رشته باشد")
			.isLength({ max: 200 })
			.withMessage("نام موسسه نباید بیشتر از ۲۰۰ کاراکتر باشد"),
		body("institutionAddress")
			.notEmpty()
			.withMessage("آدرس موسسه الزامی است")
			.bail()
			.isString()
			.withMessage("آدرس موسسه باید رشته باشد")
			.isLength({ max: 1000 })
			.withMessage("آدرس موسسه نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),
		body("registrationId")
			.optional({ nullable: true })
			.isString()
			.withMessage("شناسه ثبت باید رشته باشد")
			.isLength({ max: 50 })
			.withMessage("شناسه ثبت معتبر نیست"),
	],
};

export default EnterpriseCustomerValidation;

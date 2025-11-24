import { body, check, query } from "express-validator";

const JusticeInquiryValidation = {
	createJusticeInquiry: [
		body("justiceInquiryName").notEmpty().withMessage("وارد کردن استعلام الزامی است")
	],
	updateJusticeInquiry: [
		body("justiceInquiryName").notEmpty().withMessage("وارد کردن استعلام الزامی است"),
		body("isActive").notEmpty().withMessage("وارد کردن وضعیت الزامی است"),
	],
};

export default JusticeInquiryValidation;

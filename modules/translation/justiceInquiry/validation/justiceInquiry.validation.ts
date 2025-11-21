import { body, check, query } from "express-validator";

const JusticeInquiryValidation = {
	createJusticeInquiry: [
		body("justiceInquiryName").notEmpty().withMessage("وارد کردن استعلام الزامی است")
	],
};

export default JusticeInquiryValidation;

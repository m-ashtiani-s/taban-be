import { body, param } from "express-validator";

const JusticeInquiryValidation = {
	justiceInquiryId: [
		param("justiceInquiryId")
			.notEmpty()
			.withMessage("شناسه استعلام الزامی است")
			.isMongoId()
			.withMessage("شناسه استعلام معتبر نیست"),
	],
	createJusticeInquiry: [
		body("justiceInquiryName").notEmpty().withMessage("وارد کردن استعلام الزامی است")
	],
	updateJusticeInquiry: [
		body("justiceInquiryName").notEmpty().withMessage("وارد کردن استعلام الزامی است"),
		body("isActive").notEmpty().withMessage("وارد کردن وضعیت الزامی است"),
	],
};

export default JusticeInquiryValidation;

import { body } from "express-validator";

const RateCalculatorValidation = {
	calculate: [
		body("translationItemId")
			.notEmpty()
			.withMessage("وارد کردن مدرک الزامی است")
			.isMongoId()
			.withMessage("شناسه مدرک معتبر نیست"),
		body("languageId")
			.notEmpty()
			.withMessage("وارد کردن زبان الزامی است")
			.isMongoId()
			.withMessage("شناسه زبان معتبر نیست"),
		body("documents")
			.isArray({ min: 1 })
			.withMessage("حداقل یک مدرک باید ارسال شود"),
		body("documents.*.documentKey")
			.notEmpty()
			.withMessage("شناسه‌ی موقت مدرک الزامی است")
			.isString()
			.withMessage("شناسه‌ی موقت مدرک باید رشته باشد"),
		body("documents.*.title")
			.notEmpty()
			.withMessage("عنوان مدرک الزامی است")
			.isString()
			.withMessage("عنوان مدرک باید رشته باشد"),
		body("documents.*.baseRateCount")
			.isInt({ min: 1 })
			.withMessage("تعداد نرخ پایه باید عدد صحیح بزرگ‌تر از صفر باشد"),
		body("documents.*.copyCount")
			.optional({ nullable: true })
			.isInt({ min: 1 })
			.withMessage("تعداد نسخه باید عدد صحیح بزرگ‌تر از صفر باشد"),
		body("documents.*.specials")
			.isArray()
			.withMessage("لیست خاص‌های ترجمه باید آرایه باشد"),
		body("documents.*.specials.*.dynamicRateId")
			.isMongoId()
			.withMessage("شناسه نرخ خاص معتبر نیست"),
		body("documents.*.specials.*.count")
			.isInt({ min: 0 })
			.withMessage("تعداد نرخ خاص باید عدد صحیح غیرمنفی باشد"),
		body("documents.*.mfaCertificationRateId")
			.optional({ nullable: true })
			.isMongoId()
			.withMessage("شناسه تایید وزارت خارجه معتبر نیست"),
		body("documents.*.justiceCertificationRateId")
			.optional({ nullable: true })
			.isMongoId()
			.withMessage("شناسه تایید دادگستری معتبر نیست"),
		body("documents.*.justiceInquiryRateIds")
			.isArray()
			.withMessage("لیست استعلام‌ها باید آرایه باشد"),
		body("documents.*.justiceInquiryRateIds.*")
			.isMongoId()
			.withMessage("شناسه استعلام معتبر نیست"),
		body("documents.*.embassyRateIds")
			.optional({ nullable: true })
			.isArray()
			.withMessage("لیست تایید سفارت‌ها باید آرایه باشد"),
		body("documents.*.embassyRateIds.*")
			.isMongoId()
			.withMessage("شناسه تایید سفارت معتبر نیست"),
		body("documents.*.assets")
			.optional({ nullable: true })
			.isArray()
			.withMessage("لیست فایل‌های مدرک باید آرایه باشد"),
		body("documents.*.assets.*")
			.isString()
			.withMessage("شناسه فایل مدرک معتبر نیست"),
	],
};

export default RateCalculatorValidation;

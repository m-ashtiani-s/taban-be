import { body, param, query } from "express-validator";

const couponBodyFields = [
	body("code")
		.notEmpty()
		.withMessage("کد تخفیف الزامی است")
		.bail()
		.isString()
		.withMessage("کد تخفیف باید رشته باشد")
		.bail()
		.isLength({ min: 3, max: 30 })
		.withMessage("کد تخفیف باید بین ۳ تا ۳۰ کاراکتر باشد")
		.matches(/^[A-Za-z0-9_-]+$/)
		.withMessage("کد تخفیف فقط می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد"),

	body("discountType")
		.notEmpty()
		.withMessage("نوع تخفیف الزامی است")
		.bail()
		.isIn(["percent", "fixed"])
		.withMessage("نوع تخفیف باید درصدی یا مقداری باشد"),

	body("discountValue")
		.notEmpty()
		.withMessage("مقدار تخفیف الزامی است")
		.bail()
		.isFloat({ min: 0.01 })
		.withMessage("مقدار تخفیف باید عددی مثبت باشد")
		.custom((value, { req }) => {
			if (req.body.discountType === "percent" && Number(value) > 100) {
				throw new Error("مقدار تخفیف درصدی نمی‌تواند بیشتر از ۱۰۰ باشد");
			}
			return true;
		}),

	body("maxDiscountAmount")
		.optional({ nullable: true })
		.isFloat({ min: 0 })
		.withMessage("حداکثر مقدار قابل اعمال باید عددی غیرمنفی باشد"),

	body("minPurchaseAmount")
		.optional({ nullable: true })
		.isFloat({ min: 0 })
		.withMessage("حداقل مقدار قابل اعمال باید عددی غیرمنفی باشد"),

	body("startDate")
		.optional({ nullable: true })
		.isISO8601()
		.withMessage("فرمت تاریخ شروع معتبر نیست"),

	body("endDate")
		.optional({ nullable: true })
		.isISO8601()
		.withMessage("فرمت تاریخ پایان معتبر نیست")
		.custom((value, { req }) => {
			if (!value || !req.body.startDate) return true;
			if (new Date(value) <= new Date(req.body.startDate)) {
				throw new Error("تاریخ پایان باید بعد از تاریخ شروع باشد");
			}
			return true;
		}),

	body("usageLimit")
		.optional({ nullable: true })
		.isInt({ min: 0 })
		.withMessage("محدودیت تعداد کل استفاده باید عددی صحیح و غیرمنفی باشد"),

	body("perUserLimit")
		.optional({ nullable: true })
		.isInt({ min: 0 })
		.withMessage("محدودیت تعداد استفاده هر کاربر باید عددی صحیح و غیرمنفی باشد"),

	body("isActive").optional().isBoolean().withMessage("مقدار فعال/غیرفعال معتبر نیست"),

	body("description")
		.optional({ nullable: true })
		.isString()
		.withMessage("توضیحات باید رشته باشد")
		.isLength({ max: 500 })
		.withMessage("توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد"),

	body("appliesTo")
		.notEmpty()
		.withMessage("محل اعمال کد تخفیف الزامی است")
		.bail()
		.isIn(["base", "total"])
		.withMessage("محل اعمال کد تخفیف معتبر نیست"),

	body("applicableTranslationItems")
		.optional({ nullable: true })
		.isArray()
		.withMessage("لیست مدارک مجاز باید آرایه باشد"),
	body("applicableTranslationItems.*").isMongoId().withMessage("شناسه مدرک معتبر نیست"),
];

const CouponValidation = {
	couponId: [
		param("couponId")
			.notEmpty()
			.withMessage("شناسه کد تخفیف الزامی است")
			.isMongoId()
			.withMessage("شناسه کد تخفیف معتبر نیست"),
	],

	getCoupons: [
		query("term").optional().isString().withMessage("فرمت جستجو صحیح نیست").trim(),
		query("discountType").optional().isIn(["percent", "fixed"]).withMessage("نوع تخفیف معتبر نیست"),
		query("appliesTo").optional().isIn(["base", "total"]).withMessage("محل اعمال معتبر نیست"),
		query("isActive").optional().isBoolean({ strict: false }).withMessage("مقدار وضعیت معتبر نیست"),
		query("page").optional().isInt({ min: 1 }).withMessage("شماره صفحه باید عددی صحیح باشد"),
		query("pageSize").optional().isInt({ min: 1, max: 100 }).withMessage("اندازه صفحه معتبر نیست"),
	],

	createCoupon: couponBodyFields,

	updateCoupon: couponBodyFields,
};

export default CouponValidation;

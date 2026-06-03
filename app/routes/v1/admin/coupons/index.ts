import express from "express";
import AdminCouponController from "../../../../../modules/coupon/controller/adminCoupon.controller";
import CouponValidation from "../../../../../modules/coupon/validation/coupon.validation";

const adminCouponsRouter = express.Router();
const adminCouponController = new AdminCouponController();

adminCouponsRouter.get("/", CouponValidation.getCoupons, adminCouponController.getCoupons);
adminCouponsRouter.get("/:couponId", CouponValidation.couponId, adminCouponController.getCouponById);
adminCouponsRouter.post("/", CouponValidation.createCoupon, adminCouponController.createCoupon);
adminCouponsRouter.put(
	"/:couponId",
	CouponValidation.couponId,
	CouponValidation.updateCoupon,
	adminCouponController.updateCoupon
);
adminCouponsRouter.put(
	"/:couponId/activate",
	CouponValidation.couponId,
	adminCouponController.activateCoupon
);
adminCouponsRouter.put(
	"/:couponId/deactivate",
	CouponValidation.couponId,
	adminCouponController.deactivateCoupon
);

export default adminCouponsRouter;

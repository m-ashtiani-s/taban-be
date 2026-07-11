import express from "express";
import PaymentController from "../../../../../modules/payment/controller/payment.controller";

// روت عمومی (بدون احراز هویت) برای callback درگاه پرداخت. مرورگر کاربر بعد از پرداخت
// توسط زرین‌پال به این آدرس هدایت می‌شود.
const publicPaymentsRouter = express.Router();
const paymentController = new PaymentController();

publicPaymentsRouter.get("/zarinpal/callback", paymentController.zarinpalCallback);

export default publicPaymentsRouter;

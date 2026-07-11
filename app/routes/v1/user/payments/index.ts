import express from "express";
import PaymentController from "../../../../../modules/payment/controller/payment.controller";
import PaymentValidation from "../../../../../modules/payment/validation/payment.validation";

const userPaymentsRouter = express.Router();
const paymentController = new PaymentController();

// شروع پرداخت برای یک سفارش تاییدشده
userPaymentsRouter.post("/", PaymentValidation.initiate, paymentController.initiate);

export default userPaymentsRouter;

import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import Config from "../../../config/config";
import PaymentService from "../service/payment.service";

const paymentService = new PaymentService();

export default class PaymentController extends ControllerBase {
	// شروع پرداخت یک سفارش (نیازمند احراز هویت کاربر)
	initiate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const userId = req?.user?._id as string;
			const result = await paymentService.initiateForOrder(userId, req.body.orderId, req.body.backUrl ?? null);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "initiatePayment",
				success: false,
				data: null,
				message: error.message || "شروع پرداخت با خطا مواجه شد",
			});
		}
	};

	// callback درگاه زرین‌پال — عمومی و بدون احراز هویت (مرورگر کاربر بعد از پرداخت به اینجا هدایت می‌شود).
	// نتیجه را به صفحه‌ی نتیجه‌ی فرانت redirect می‌کنیم.
	zarinpalCallback = async (req: Request, res: Response) => {
		try {
			const authority = (req.query.Authority as string) ?? (req.query.authority as string);
			const status = (req.query.Status as string) ?? (req.query.status as string);
			const redirectUrl = await paymentService.handleZarinpalCallback(authority, status);
			return res.redirect(302, redirectUrl);
		} catch (error) {
			// در بدترین حالت هم کاربر نباید روی صفحه‌ی خطای بکند بماند
			return res.redirect(302, `${Config.zarinpal.frontendResultUrl}?status=failed&reason=server`);
		}
	};
}

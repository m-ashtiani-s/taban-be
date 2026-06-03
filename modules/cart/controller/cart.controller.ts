import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import CartService from "../service/cart.service";
import { AddDocumentToCartDto } from "../dto/cartItem.dto";

const cartService = new CartService();

export default class CartController extends ControllerBase {
	addDocumentToCart = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const payload: AddDocumentToCartDto = req?.body;
			const result = await cartService.addDocumentToCart(req.user?._id as string, payload);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "addDocumentToCart",
				success: false,
				data: null,
				message: error.message || "مشکلی در افزودن پرونده به سبد خرید رخ داد",
			});
		}
	};

	removeDocumentFromCart = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const cartItemId = req.params.cartItemId;
			const result = await cartService.removeDocumentFromCart(req.user?._id as string, cartItemId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "removeDocumentFromCart",
				success: false,
				data: null,
				message: error.message || "مشکلی در حذف پرونده از سبد خرید رخ داد",
			});
		}
	};

	updateDocumentInCart = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const payload: AddDocumentToCartDto = req?.body;
			const cartItemId = req.params.cartItemId;
			const result = await cartService.updateDocumentInCart(req.user?._id as string, cartItemId, payload);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateDocumentInCart",
				success: false,
				data: null,
				message: error.message || "مشکلی در بروزرسانی پرونده سبد خرید رخ داد",
			});
		}
	};

	getCartByUserId = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const result = await cartService.getCartByUserId(req.user?._id as string);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getCartByUserId",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت سبد خرید رخ داد",
			});
		}
	};

	applyCouponToCart = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const couponCode = (req.body?.couponCode as string) ?? "";
			const result = await cartService.applyCouponToCart(req.user?._id as string, couponCode);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "applyCouponToCart",
				success: false,
				data: null,
				message: error.message || "اعمال کد تخفیف با خطا مواجه شد",
			});
		}
	};

	removeCouponFromCart = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const result = await cartService.removeCouponFromCart(req.user?._id as string);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "removeCouponFromCart",
				success: false,
				data: null,
				message: error.message || "حذف کد تخفیف با خطا مواجه شد",
			});
		}
	};
}

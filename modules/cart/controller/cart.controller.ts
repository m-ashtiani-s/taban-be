import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import CartService from "../service/cart.service";
import { OrderedDocumentDto } from "../dto/orderedDocumentDto.dto";
const cartService = new CartService();

export default class CartController extends ControllerBase {
	addDocumentToCart = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const addDocumentToCartData: OrderedDocumentDto = req?.body;
			const result = await cartService.addDocumentToCart(req.user?._id as string, addDocumentToCartData);
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
}

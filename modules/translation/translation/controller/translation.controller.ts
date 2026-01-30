import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import CartService from "../../../cart/service/cart.service";
import { OrderedDocumentDto } from "../../../cart/dto/orderedDocumentDto.dto";
const cartService = new CartService();

export class TranslationController extends ControllerBase {
	calculateDocumentPrice = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const document: OrderedDocumentDto = req.body;
			const result = await cartService.calculateDocumentPrice(document);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "calculateDocumentPrice",
				success: false,
				data: null,
				message: error.message || "مشکلی در محاسبه نرخ رخ داد",
			});
		}
	};
}

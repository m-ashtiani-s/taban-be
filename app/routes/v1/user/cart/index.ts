import express from "express";
import CartController from "../../../../../modules/cart/controller/cart.controller";
import CartValidation from "../../../../../modules/cart/validation/cart.validation";

const cartRouter = express.Router();
const cartController = new CartController();

cartRouter.get("/", cartController.getCartByUserId);
cartRouter.post("/", CartValidation.addDocumentToCart, cartController.addDocumentToCart);
cartRouter.delete(
	"/items/:cartItemId",
	CartValidation.removeDocumentFromCart,
	cartController.removeDocumentFromCart
);
cartRouter.put(
	"/items/:cartItemId",
	CartValidation.updateDocumentInCart,
	cartController.updateDocumentInCart
);
cartRouter.post("/coupon", CartValidation.applyCouponToCart, cartController.applyCouponToCart);
cartRouter.delete("/coupon", cartController.removeCouponFromCart);

export default cartRouter;

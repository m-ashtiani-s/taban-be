import express from "express";
import OrderController from "../../../../../modules/order/controller/order.controller";
import OrderValidation from "../../../../../modules/order/validation/order.validation";

const userOrdersRouter = express.Router();
const orderController = new OrderController();

userOrdersRouter.post("/", OrderValidation.createOrder, orderController.createOrder);
userOrdersRouter.get("/", OrderValidation.getOrders, orderController.getOrders);
userOrdersRouter.get("/:orderId", OrderValidation.orderId, orderController.getOrderById);
userOrdersRouter.get("/:orderId/invoice", OrderValidation.orderId, orderController.downloadInvoice);
userOrdersRouter.put("/:orderId/pay", OrderValidation.orderId, orderController.payOrder);
userOrdersRouter.delete("/:orderId/coupon", OrderValidation.orderId, orderController.removeCouponFromOrder);
userOrdersRouter.put("/:orderId/items/:cartItemId", OrderValidation.updateOrderItem, orderController.updateOrderItem);

export default userOrdersRouter;

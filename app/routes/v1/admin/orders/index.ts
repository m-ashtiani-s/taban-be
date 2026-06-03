import express from "express";
import AdminOrderController from "../../../../../modules/order/controller/adminOrder.controller";
import AdminOrderValidation from "../../../../../modules/order/validation/adminOrder.validation";

const adminOrdersRouter = express.Router();
const adminOrderController = new AdminOrderController();

adminOrdersRouter.get("/", AdminOrderValidation.getOrders, adminOrderController.getOrders);
adminOrdersRouter.get("/:orderId", AdminOrderValidation.orderId, adminOrderController.getOrderById);
adminOrdersRouter.put(
	"/:orderId/status",
	AdminOrderValidation.updateOrderStatus,
	adminOrderController.updateOrderStatus
);

export default adminOrdersRouter;

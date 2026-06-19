import express from "express";
import AdminOrderController from "../../../../../modules/order/controller/order.admin.controller";
import AdminOrderValidation from "../../../../../modules/order/validation/order.admin.validation";

const adminOrdersRouter = express.Router();
const adminOrderController = new AdminOrderController();

adminOrdersRouter.get("/", AdminOrderValidation.getOrders, adminOrderController.getOrders);
adminOrdersRouter.get("/:orderId", AdminOrderValidation.orderId, adminOrderController.getOrderById);
adminOrdersRouter.put(
	"/:orderId/status",
	AdminOrderValidation.updateOrderStatus,
	adminOrderController.updateOrderStatus
);
adminOrdersRouter.put(
	"/:orderId/cart-items/:cartItemId/documents/:documentKey/scan-assets",
	AdminOrderValidation.updateDocumentScanAssets,
	adminOrderController.updateDocumentScanAssets
);
adminOrdersRouter.put(
	"/:orderId/cart-items/:cartItemId/official",
	AdminOrderValidation.updateOrderItemOfficial,
	adminOrderController.updateOrderItemOfficial
);

export default adminOrdersRouter;

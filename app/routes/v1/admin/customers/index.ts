import express from "express";
import AdminCustomerController from "../../../../../modules/customer/controller/customer.admin.controller";
import AdminCustomerValidation from "../../../../../modules/customer/validation/customer.admin.validation";

const adminCustomersRouter = express.Router();
const adminCustomerController = new AdminCustomerController();

adminCustomersRouter.get("/", AdminCustomerValidation.getCustomers, adminCustomerController.getCustomers);
adminCustomersRouter.get("/:customerId", AdminCustomerValidation.customerId, adminCustomerController.getCustomerById);
adminCustomersRouter.put(
	"/:customerId",
	AdminCustomerValidation.customerId,
	AdminCustomerValidation.updateCustomer,
	adminCustomerController.updateCustomer
);
adminCustomersRouter.put("/:customerId/activate", AdminCustomerValidation.customerId, adminCustomerController.activateCustomer);
adminCustomersRouter.put("/:customerId/deactivate", AdminCustomerValidation.customerId, adminCustomerController.deactivateCustomer);

export default adminCustomersRouter;

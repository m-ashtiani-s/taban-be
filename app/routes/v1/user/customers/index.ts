import express from "express";
import CustomerController from "../../../../../modules/customer/controller/customer.controller";
import CustomerValidation from "../../../../../modules/customer/validation/customer.validation";
import EnterpriseAuthMiddleware from "../../../../../middleware/auth/enterpriseAuth.middleware";

const userCustomersRouter = express.Router();
const customerController = new CustomerController();

// تمام مسیرهای مدیریت مشتریان زیرمجموعه فقط برای مشتری سازمانی در دسترس است
userCustomersRouter.use(EnterpriseAuthMiddleware);

userCustomersRouter.get("/", CustomerValidation.getCustomers, customerController.getCustomers);
userCustomersRouter.post("/", CustomerValidation.createCustomer, customerController.createCustomer);
userCustomersRouter.get("/:customerId", CustomerValidation.customerId, customerController.getCustomerById);
userCustomersRouter.put(
	"/:customerId",
	CustomerValidation.customerId,
	CustomerValidation.updateCustomer,
	customerController.updateCustomer
);
userCustomersRouter.put("/:customerId/activate", CustomerValidation.customerId, customerController.activateCustomer);
userCustomersRouter.put("/:customerId/deactivate", CustomerValidation.customerId, customerController.deactivateCustomer);

export default userCustomersRouter;

import express from "express";
import EnterpriseCustomerController from "../../../../../modules/enterpriseCustomer/controller/enterpriseCustomer.controller";
import EnterpriseCustomerValidation from "../../../../../modules/enterpriseCustomer/validation/enterpriseCustomer.validation";

const userEnterpriseCustomersRouter = express.Router();
const enterpriseCustomerController = new EnterpriseCustomerController();

userEnterpriseCustomersRouter.post("/", EnterpriseCustomerValidation.register, enterpriseCustomerController.register);
userEnterpriseCustomersRouter.get("/me", enterpriseCustomerController.getMyEnterpriseProfile);

export default userEnterpriseCustomersRouter;

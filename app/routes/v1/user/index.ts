import express from "express";
import UserController from "../../../../modules/user/controller/user.controller";
import UserValidation from "../../../../modules/user/validation/user.validation";
import cartRouter from "./cart";
import userShippingAddressesRouter from "./shipping-addresses";
import userPassportsRouter from "./passports";
import userOrdersRouter from "./orders";
import userEnterpriseCustomersRouter from "./enterprise-customers";
import userCustomersRouter from "./customers";
import userInvoicesRouter from "./invoices";
import userClubRouter from "./club";
import userPaymentsRouter from "./payments";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/profile-completion", userController.profileCompletionStatus);
userRouter.put("/", UserValidation.updateUser, userController.updateUser);
userRouter.get("/", userController.getUser);

userRouter.use("/cart", cartRouter);
userRouter.use("/shipping-addresses", userShippingAddressesRouter);
	userRouter.use("/passports", userPassportsRouter);
userRouter.use("/orders", userOrdersRouter);
userRouter.use("/enterprise-customers", userEnterpriseCustomersRouter);
userRouter.use("/customers", userCustomersRouter);
userRouter.use("/invoices", userInvoicesRouter);
userRouter.use("/club", userClubRouter);
userRouter.use("/payments", userPaymentsRouter);

export default userRouter;

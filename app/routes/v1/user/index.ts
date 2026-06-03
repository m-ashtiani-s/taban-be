import express from "express";
import UserController from "../../../../modules/user/controller/user.controller";
import UserValidation from "../../../../modules/user/validation/user.validation";
import cartRouter from "./cart";
import userShippingAddressesRouter from "./shipping-addresses";
import userOrdersRouter from "./orders";
import userEnterpriseCustomersRouter from "./enterprise-customers";
import userCustomersRouter from "./customers";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/profile-completion", userController.profileCompletionStatus);
userRouter.put("/", UserValidation.updateUser, userController.updateUser);
userRouter.get("/", userController.getUser);

userRouter.use("/cart", cartRouter);
userRouter.use("/shipping-addresses", userShippingAddressesRouter);
userRouter.use("/orders", userOrdersRouter);
userRouter.use("/enterprise-customers", userEnterpriseCustomersRouter);
userRouter.use("/customers", userCustomersRouter);

export default userRouter;

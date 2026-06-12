import express from "express";
import translationRouter from "./translation";
import adminCouponsRouter from "./coupons";
import adminShippingAddressesRouter from "./shipping-addresses";
import adminPassportsRouter from "./passports";
import adminOrdersRouter from "./orders";
import adminUsersRouter from "./users";
import adminCustomersRouter from "./customers";

const adminRouter = express.Router();

adminRouter.use("/translation", translationRouter);
adminRouter.use("/coupons", adminCouponsRouter);
adminRouter.use("/shipping-addresses", adminShippingAddressesRouter);
adminRouter.use("/passports", adminPassportsRouter);
adminRouter.use("/orders", adminOrdersRouter);
adminRouter.use("/users", adminUsersRouter);
adminRouter.use("/customers", adminCustomersRouter);

export default adminRouter;

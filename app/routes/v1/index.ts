import express from "express";
import adminRouter from "./admin";
import userRouter from "./user";
import AuthMiddleware from "../../../middleware/auth/auth.middleware";
import AdminAuthMiddleware from "../../../middleware/auth/adminAuth.middleware";
import publicRouter from "./public";
import authRouter from "./auth";

const v1Router = express.Router();


v1Router.use("/v1/admin",AuthMiddleware,AdminAuthMiddleware, adminRouter);
v1Router.use("/v1/user",AuthMiddleware, userRouter);
v1Router.use("/v1", publicRouter);
v1Router.use("/v1/auth", authRouter);


export default v1Router;

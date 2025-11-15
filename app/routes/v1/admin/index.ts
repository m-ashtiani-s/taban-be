import express from "express";
import translationRouter from "./translation";

const adminRouter = express.Router();

// adminRouter.get("/users", userController.getUsersList.bind(userController));
adminRouter.use("/translation", translationRouter);

export default adminRouter;

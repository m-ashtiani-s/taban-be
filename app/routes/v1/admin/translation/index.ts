import express from "express";
import translationItemsRouter from "./translation-items";
import languagesRouter from "./languages";
import baseRateRouter from "./base-rate";
import dynamicRateRouter from "./dynamic-rate";

const translationRouter = express.Router();

translationRouter.use("/translation-items", translationItemsRouter);
translationRouter.use("/languages", languagesRouter);
translationRouter.use("/base-rate", baseRateRouter);
translationRouter.use("/dynamic-rate", dynamicRateRouter);

export default translationRouter;

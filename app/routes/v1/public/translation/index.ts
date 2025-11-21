import express from "express";
import translationItemsRouter from "./translation-items";
import languagesRouter from "./languages";
import dynamicRateRouter from "./dynamic-rate";
import certificationRateRouter from "./certification-rate";

const translationRouter = express.Router();

translationRouter.use("/translation-items", translationItemsRouter);
translationRouter.use("/languages", languagesRouter);
translationRouter.use("/dynamic-rate", dynamicRateRouter);
translationRouter.use("/certification-rate", certificationRateRouter);
export default translationRouter;

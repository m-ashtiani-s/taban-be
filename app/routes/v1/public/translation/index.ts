import express from "express";
import translationItemsRouter from "./translation-items";
import languagesRouter from "./languages";
import dynamicRateRouter from "./dynamic-rate";
import certificationRateRouter from "./certification-rate";
import justiceInquiryRateRouter from "./justice-inquiry-rate";
import translationItemsCategoriesRouter from "./translation-items-categories";
import baseRateRouter from "./base-rate";

const translationRouter = express.Router();

translationRouter.use("/base-rate", baseRateRouter);
translationRouter.use("/translation-items", translationItemsRouter);
translationRouter.use("/translation-item-categories", translationItemsCategoriesRouter);
translationRouter.use("/languages", languagesRouter);
translationRouter.use("/dynamic-rate", dynamicRateRouter);
translationRouter.use("/certification-rate", certificationRateRouter);
translationRouter.use("/justice-inquiry-rate", justiceInquiryRateRouter);
export default translationRouter;

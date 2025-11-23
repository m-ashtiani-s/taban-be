import express from "express";
import translationItemsRouter from "./translation-items";
import languagesRouter from "./languages";
import baseRateRouter from "./base-rate";
import dynamicRateRouter from "./dynamic-rate";
import certificationRateRouter from "./certification-rate";
import justiceInquiryRouter from "./justice-inquiry";
import justiceInquiryRateRouter from "./justice-inquiry-rate";
import translationItemsCategoriesRouter from "./translation-items-categories";

const translationRouter = express.Router();

translationRouter.use("/translation-items", translationItemsRouter);
translationRouter.use("/translation-item-categories", translationItemsCategoriesRouter);
translationRouter.use("/languages", languagesRouter);
translationRouter.use("/base-rate", baseRateRouter);
translationRouter.use("/dynamic-rate", dynamicRateRouter);
translationRouter.use("/certification-rate", certificationRateRouter);
translationRouter.use("/justice-inquiry", justiceInquiryRouter);
translationRouter.use("/justice-inquiry-rate", justiceInquiryRateRouter);

export default translationRouter;

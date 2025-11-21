import express from "express";
import JusticeInquiryRateController from "../../../../../../modules/translation/justiceInquiryRate/controller/justiceInquiryRate.controller";

const justiceInquiryRateRouter = express.Router();
const justiceInquiryRateController = new JusticeInquiryRateController();

justiceInquiryRateRouter.get("/", justiceInquiryRateController.getJusticeInquiryRates);
export default justiceInquiryRateRouter;

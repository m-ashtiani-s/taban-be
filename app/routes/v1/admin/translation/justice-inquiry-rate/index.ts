import express from "express";
import JusticeInquiryRateAdminController from "../../../../../../modules/translation/justiceInquiryRate/controller/justiceInquiryRate.admin.controller";
import { JusticeInquiryRateValidation } from "../../../../../../modules/translation/justiceInquiryRate/validation/justiceInquiryRate.validation";

const justiceInquiryRateRouter = express.Router();
const justiceInquiryRateAdminController = new JusticeInquiryRateAdminController();

justiceInquiryRateRouter.post("/", JusticeInquiryRateValidation.createJusticeInquiryRate, justiceInquiryRateAdminController.createJusticeInquiryRate);
justiceInquiryRateRouter.get("/", justiceInquiryRateAdminController.getJusticeInquiryRates);
justiceInquiryRateRouter.get("/:justiceInquiryRateId", justiceInquiryRateAdminController.getJusticeInquiryRate);
justiceInquiryRateRouter.delete("/:justiceInquiryRateId", justiceInquiryRateAdminController.deleteJusticeInquiryRate);
justiceInquiryRateRouter.put("/:justiceInquiryRateId/price", JusticeInquiryRateValidation.updateJusticeInquiryRatePrice, justiceInquiryRateAdminController.updateJusticeInquiryRatePrice);
export default justiceInquiryRateRouter;

import express from "express";
import { JusticeInquiryAdminController } from "../../../../../../modules/translation/justiceInquiry/controller/justiceInquiry.admin.controller";
import JusticeInquiryValidation from "../../../../../../modules/translation/justiceInquiry/validation/justiceInquiry.validation";

const justiceInquiryRouter = express.Router();
const justiceInquiryAdminController = new JusticeInquiryAdminController();

justiceInquiryRouter.post("/",JusticeInquiryValidation.createJusticeInquiry, justiceInquiryAdminController.createJusticeInquiry);
justiceInquiryRouter.get("/", justiceInquiryAdminController.getJusticeInquiryies);
justiceInquiryRouter.get("/:justiceInquiryId", JusticeInquiryValidation.justiceInquiryId, justiceInquiryAdminController.getJusticeInquiry);
justiceInquiryRouter.post("/:justiceInquiryId/activate", JusticeInquiryValidation.justiceInquiryId, justiceInquiryAdminController.activateJusticeInquiry);
justiceInquiryRouter.post("/:justiceInquiryId/deactivate", JusticeInquiryValidation.justiceInquiryId, justiceInquiryAdminController.deactivateJusticeInquiry);
justiceInquiryRouter.put("/:justiceInquiryId", JusticeInquiryValidation.justiceInquiryId, JusticeInquiryValidation.updateJusticeInquiry, justiceInquiryAdminController.updateJusticeInquiry);
justiceInquiryRouter.delete("/:justiceInquiryId", JusticeInquiryValidation.justiceInquiryId, justiceInquiryAdminController.deleteJusticeInquiry);
export default justiceInquiryRouter;

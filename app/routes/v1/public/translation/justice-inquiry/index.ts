import express from "express";
import JusticeInquiryController from "../../../../../../modules/translation/justiceInquiry/controller/justiceInquiry.controller";

const justiceInquiryRouter = express.Router();
const justiceInquiryController = new JusticeInquiryController();

justiceInquiryRouter.get("/", justiceInquiryController.getJusticeInquirys);
justiceInquiryRouter.get("/:justiceInquiryId", justiceInquiryController.getJusticeInquiry);
export default justiceInquiryRouter;

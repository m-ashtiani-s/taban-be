import express from "express";
import EmbassyRateAdminController from "../../../../../../modules/translation/embassyRate/controller/embassyRate.admin.controller";
import { EmbassyRateValidation } from "../../../../../../modules/translation/embassyRate/validation/embassyRate.validation";

const embassyRateRouter = express.Router();
const embassyRateAdminController = new EmbassyRateAdminController();

embassyRateRouter.post("/", EmbassyRateValidation.createEmbassyRate, embassyRateAdminController.createEmbassyRate);
embassyRateRouter.get("/", embassyRateAdminController.getEmbassyRates);
embassyRateRouter.get("/:embassyRateId", embassyRateAdminController.getEmbassyRate);
embassyRateRouter.delete("/:embassyRateId", embassyRateAdminController.deleteEmbassyRate);
embassyRateRouter.put("/bulk-update", embassyRateAdminController.bulkUpdateEmbassyRatePrice);
embassyRateRouter.put("/:embassyRateId/price", EmbassyRateValidation.updateEmbassyRatePrice, embassyRateAdminController.updateEmbassyRatePrice);
export default embassyRateRouter;

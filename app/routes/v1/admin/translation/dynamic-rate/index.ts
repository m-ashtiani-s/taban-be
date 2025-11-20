import express from "express";
import { DynaminRateValidation } from "../../../../../../modules/translation/dynamicRate/validation/dynamicRate.validation";
import DynamicRateAdminController from "../../../../../../modules/translation/dynamicRate/controller/dynamicRate.admin.controller";

const dynamicRateRouter = express.Router();
const dynamicRateAdminController = new DynamicRateAdminController();

dynamicRateRouter.post("/",DynaminRateValidation.createDynamicRate, dynamicRateAdminController.createDynamicRate);
dynamicRateRouter.get("/", dynamicRateAdminController.getDynamicRates);
dynamicRateRouter.get("/:dynamicRateId", dynamicRateAdminController.getDynamicRate);
dynamicRateRouter.delete("/:dynamicRateId", dynamicRateAdminController.deleteDynamicRate);
export default dynamicRateRouter;

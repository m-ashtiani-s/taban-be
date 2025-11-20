import express from "express";
import DynamicRateController from "../../../../../../modules/translation/dynamicRate/controller/dynamicRate.controller";
import { DynaminRateValidation } from "../../../../../../modules/translation/dynamicRate/validation/dynamicRate.validation";

const dynamicRateRouter = express.Router();
const dynamicRateController = new DynamicRateController();

dynamicRateRouter.get("/", dynamicRateController.getDynamicRates);
dynamicRateRouter.post("/",DynaminRateValidation.createDynamicRate, dynamicRateController.createDynamicRate);
export default dynamicRateRouter;

import express from "express";
import BaseRateController from "../../../../../../modules/translation/baseRate/controller/baseRate.controller";
import DynamicRateController from "../../../../../../modules/translation/dynamicRate/controller/dynamicRate.controller";

const dynamicRateRouter = express.Router();
const dynamicRateController = new DynamicRateController();

dynamicRateRouter.get("/", dynamicRateController.getDynamicRates);
export default dynamicRateRouter;

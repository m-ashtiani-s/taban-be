import express from "express";
import DynamicRateController from "../../../../../../modules/translation/dynamicRate/controller/dynamicRate.controller";

const dynamicRateRouter = express.Router();
const dynamicRateController = new DynamicRateController();

dynamicRateRouter.get("/", dynamicRateController.getDynamicRates);
export default dynamicRateRouter;

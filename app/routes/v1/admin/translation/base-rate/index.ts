import express from "express";
import BaseRateController from "../../../../../../modules/translation/baseRate/controller/baseRate.controller";
import BaseRateValidation from "../../../../../../modules/translation/baseRate/validation/baseRate.validation";

const baseRateRouter = express.Router();
const baseRateController = new BaseRateController();

baseRateRouter.get("/", baseRateController.getBaseRates);
baseRateRouter.post("/",BaseRateValidation.createBaseRate, baseRateController.createBaseRate);
export default baseRateRouter;

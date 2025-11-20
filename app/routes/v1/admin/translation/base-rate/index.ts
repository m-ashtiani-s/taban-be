import express from "express";
import BaseRateController from "../../../../../../modules/translation/baseRate/controller/baseRate.controller";
import BaseRateValidation from "../../../../../../modules/translation/baseRate/validation/baseRate.validation";

const baseRateRouter = express.Router();
const baseRateController = new BaseRateController();

baseRateRouter.post("/", BaseRateValidation.createBaseRate, baseRateController.createBaseRate);
baseRateRouter.get("/", baseRateController.getBaseRates);
baseRateRouter.get("/:baseRateId", baseRateController.getBaseRate);
baseRateRouter.delete("/:baseRateId", baseRateController.deleteBaseRate);
baseRateRouter.put("/:baseRateId/price", BaseRateValidation.updateBaseRatePrice, baseRateController.updateBaseRatePrice);
export default baseRateRouter;

import express from "express";
import BaseRateController from "../../../../../../modules/translation/baseRate/controller/baseRate.controller";

const baseRateRouter = express.Router();
const baseRateController = new BaseRateController();

baseRateRouter.get("/", baseRateController.getBaseRates);
export default baseRateRouter;

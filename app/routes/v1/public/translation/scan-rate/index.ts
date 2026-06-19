import express from "express";
import ScanRateController from "../../../../../../modules/translation/scanRate/controller/scanRate.controller";

const scanRateRouter = express.Router();
const scanRateController = new ScanRateController();

scanRateRouter.get("/", scanRateController.getScanRates);

export default scanRateRouter;

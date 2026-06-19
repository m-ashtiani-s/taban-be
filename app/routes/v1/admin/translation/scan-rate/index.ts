import express from "express";
import ScanRateAdminController from "../../../../../../modules/translation/scanRate/controller/scanRate.admin.controller";
import { ScanRateValidation } from "../../../../../../modules/translation/scanRate/validation/scanRate.validation";

const scanRateRouter = express.Router();
const scanRateAdminController = new ScanRateAdminController();

scanRateRouter.post("/", ScanRateValidation.createScanRate, scanRateAdminController.createScanRate);
scanRateRouter.get("/", scanRateAdminController.getScanRates);
scanRateRouter.get("/:scanRateId", scanRateAdminController.getScanRate);
scanRateRouter.delete("/:scanRateId", scanRateAdminController.deleteScanRate);
scanRateRouter.put("/bulk-update", scanRateAdminController.bulkUpdateScanRatePrice);
scanRateRouter.put("/:scanRateId/price", ScanRateValidation.updateScanRatePrice, scanRateAdminController.updateScanRatePrice);

export default scanRateRouter;

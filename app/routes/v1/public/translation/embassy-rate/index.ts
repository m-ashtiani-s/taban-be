import express from "express";
import EmbassyRateController from "../../../../../../modules/translation/embassyRate/controller/embassyRate.controller";

const embassyRateRouter = express.Router();
const embassyRateController = new EmbassyRateController();

embassyRateRouter.get("/", embassyRateController.getEmbassyRates);
export default embassyRateRouter;

import express from "express";
import CertificationRateController from "../../../../../../modules/translation/certificationRate/controller/certificationRate.controller";

const certificationRateRouter = express.Router();
const certificationRateController = new CertificationRateController();

certificationRateRouter.get("/", certificationRateController.getCertificationRates);
export default certificationRateRouter;

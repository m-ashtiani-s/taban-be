import express from "express";
import CertificationRateAdminController from "../../../../../../modules/translation/certificationRate/controller/certificationRate.admin.controller";
import { CertifictionRateValidation } from "../../../../../../modules/translation/certificationRate/validation/certificationRate.validation";

const certificationRateRouter = express.Router();
const certificationRateAdminController = new CertificationRateAdminController();

certificationRateRouter.post("/", CertifictionRateValidation.createCertificationRate, certificationRateAdminController.createCertificationRate);
certificationRateRouter.get("/", certificationRateAdminController.getCertificationRates);
certificationRateRouter.get("/:certificationRateId", certificationRateAdminController.getCertificationRate);
certificationRateRouter.delete("/:certificationRateId", certificationRateAdminController.deleteCertificationRate);
certificationRateRouter.put("/:certificationRateId", CertifictionRateValidation.updateCertificationRate, certificationRateAdminController.updateCertificationRate);
export default certificationRateRouter;

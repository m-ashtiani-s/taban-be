import express from "express";
import { EmbassyAdminController } from "../../../../../../modules/translation/embassy/controller/embassy.admin.controller";
import EmbassyValidation from "../../../../../../modules/translation/embassy/validation/embassy.validation";

const embassiesRouter = express.Router();
const embassyController = new EmbassyAdminController();

embassiesRouter.get("/", embassyController.getEmbassies);
embassiesRouter.get("/:embassyId", embassyController.getEmbassy);
embassiesRouter.post("/", EmbassyValidation.createEmbassy, embassyController.createEmbassy);
embassiesRouter.post("/:embassyId/activate", embassyController.activateEmbassy);
embassiesRouter.post("/:embassyId/deactivate", embassyController.deactivateEmbassy);
embassiesRouter.put("/:embassyId",EmbassyValidation.updateEmbassy, embassyController.updateEmbassy);
export default embassiesRouter;

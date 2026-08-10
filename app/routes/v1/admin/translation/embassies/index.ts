import express from "express";
import { EmbassyAdminController } from "../../../../../../modules/translation/embassy/controller/embassy.admin.controller";
import EmbassyValidation from "../../../../../../modules/translation/embassy/validation/embassy.validation";

const embassiesRouter = express.Router();
const embassyController = new EmbassyAdminController();

embassiesRouter.get("/", embassyController.getEmbassies);
embassiesRouter.put("/order", EmbassyValidation.reorderEmbassies, embassyController.reorderEmbassies);
embassiesRouter.get("/:embassyId", EmbassyValidation.embassyId, embassyController.getEmbassy);
embassiesRouter.post("/", EmbassyValidation.createEmbassy, embassyController.createEmbassy);
embassiesRouter.post("/:embassyId/activate", EmbassyValidation.embassyId, embassyController.activateEmbassy);
embassiesRouter.post("/:embassyId/deactivate", EmbassyValidation.embassyId, embassyController.deactivateEmbassy);
embassiesRouter.put("/:embassyId", EmbassyValidation.embassyId, EmbassyValidation.updateEmbassy, embassyController.updateEmbassy);
embassiesRouter.delete("/:embassyId", EmbassyValidation.embassyId, embassyController.deleteEmbassy);
export default embassiesRouter;

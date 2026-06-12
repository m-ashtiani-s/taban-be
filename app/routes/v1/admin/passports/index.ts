import express from "express";
import AdminPassportController from "../../../../../modules/passport/controller/passport.admin.controller";
import AdminPassportValidation from "../../../../../modules/passport/validation/passport.admin.validation";

const adminPassportsRouter = express.Router();
const adminPassportController = new AdminPassportController();

adminPassportsRouter.get("/", AdminPassportValidation.getPassports, adminPassportController.getPassports);
adminPassportsRouter.get("/:passportId", AdminPassportValidation.passportId, adminPassportController.getPassportById);
adminPassportsRouter.put("/:passportId/activate", AdminPassportValidation.passportId, adminPassportController.activatePassport);
adminPassportsRouter.put("/:passportId/deactivate", AdminPassportValidation.passportId, adminPassportController.deactivatePassport);

export default adminPassportsRouter;

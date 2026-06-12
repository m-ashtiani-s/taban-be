import express from "express";
import PassportController from "../../../../../modules/passport/controller/passport.controller";
import PassportValidation from "../../../../../modules/passport/validation/passport.validation";

const userPassportsRouter = express.Router();
const passportController = new PassportController();

userPassportsRouter.post("/", PassportValidation.createPassport, passportController.createPassport);
userPassportsRouter.get("/", PassportValidation.getPassports, passportController.getPassports);
userPassportsRouter.get("/:passportId", PassportValidation.passportId, passportController.getPassportById);
userPassportsRouter.put("/:passportId/activate", PassportValidation.passportId, passportController.activatePassport);
userPassportsRouter.put("/:passportId/deactivate", PassportValidation.passportId, passportController.deactivatePassport);

export default userPassportsRouter;

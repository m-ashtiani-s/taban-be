import express from "express";
import RateCalculatorController from "../../../../../../modules/rateCalculator/controller/rateCalculator.controller";
import RateCalculatorValidation from "../../../../../../modules/rateCalculator/validation/rateCalculator.validation";
import OptionalAuthMiddleware from "../../../../../../middleware/auth/optionalAuth.middleware";

const rateCalculatorRouter = express.Router();
const rateCalculatorController = new RateCalculatorController();

rateCalculatorRouter.post(
	"/",
	OptionalAuthMiddleware,
	RateCalculatorValidation.calculate,
	rateCalculatorController.calculate
);

export default rateCalculatorRouter;

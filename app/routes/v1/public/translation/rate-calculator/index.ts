import express from "express";
import RateCalculatorController from "../../../../../../modules/rateCalculator/controller/rateCalculator.controller";
import RateCalculatorValidation from "../../../../../../modules/rateCalculator/validation/rateCalculator.validation";

const rateCalculatorRouter = express.Router();
const rateCalculatorController = new RateCalculatorController();

rateCalculatorRouter.post("/", RateCalculatorValidation.calculate, rateCalculatorController.calculate);

export default rateCalculatorRouter;

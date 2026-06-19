import express from "express";
import UrgencyController from "../../../../../modules/urgency/controller/urgency.controller";

const publicUrgencyRouter = express.Router();
const urgencyController = new UrgencyController();

publicUrgencyRouter.get("/", urgencyController.getUrgency);

export default publicUrgencyRouter;

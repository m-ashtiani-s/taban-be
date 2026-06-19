import express from "express";
import AdminUrgencyController from "../../../../../modules/urgency/controller/urgency.admin.controller";
import UrgencyValidation from "../../../../../modules/urgency/validation/urgency.admin.validation";

const adminUrgencyRouter = express.Router();
const adminUrgencyController = new AdminUrgencyController();

adminUrgencyRouter.get("/", adminUrgencyController.getUrgency);
adminUrgencyRouter.put("/", UrgencyValidation.updateUrgency, adminUrgencyController.updateUrgency);

export default adminUrgencyRouter;

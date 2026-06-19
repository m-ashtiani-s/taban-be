import express from "express";
import AdminClubController from "../../../../../modules/club/controller/club.admin.controller";
import ClubValidation from "../../../../../modules/club/validation/club.admin.validation";

const adminClubRouter = express.Router();
const adminClubController = new AdminClubController();

adminClubRouter.get("/config", adminClubController.getConfig);
adminClubRouter.put("/config", ClubValidation.updateConfig, adminClubController.updateConfig);

export default adminClubRouter;

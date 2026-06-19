import express from "express";
import ClubController from "../../../../../modules/club/controller/club.controller";

const publicClubRouter = express.Router();
const clubController = new ClubController();

publicClubRouter.get("/config", clubController.getConfig);

export default publicClubRouter;

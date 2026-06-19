import express from "express";
import ClubController from "../../../../../modules/club/controller/club.controller";

const userClubRouter = express.Router();
const clubController = new ClubController();

userClubRouter.get("/", clubController.getMyStatus);
userClubRouter.get("/history", clubController.getMyHistory);

export default userClubRouter;

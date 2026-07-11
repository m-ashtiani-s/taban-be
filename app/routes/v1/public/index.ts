import express from "express";
import LocationController from "../../../../shared/location/controller/location.controller";
import translationItemsRouter from "./translation/translation-items";
import translationRouter from "./translation";
import publicUrgencyRouter from "./urgency";
import publicClubRouter from "./club";
import publicPaymentsRouter from "./payments";

const publicRouter = express.Router();
const locationController = new LocationController();

publicRouter.use("/translation", translationRouter);
publicRouter.use("/urgency", publicUrgencyRouter);
publicRouter.use("/club", publicClubRouter);
publicRouter.use("/payments", publicPaymentsRouter);
publicRouter.get("/provinces", locationController.provinces);
publicRouter.get("/cities", locationController.cities);

export default publicRouter;

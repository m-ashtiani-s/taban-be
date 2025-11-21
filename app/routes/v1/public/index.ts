import express from "express";
import LocationController from "../../../../shared/location/controller/location.controller";
import translationItemsRouter from "./translation/translation-items";
import translationRouter from "./translation";
import justiceInquiryRouter from "./translation/justice-inquiry";

const publicRouter = express.Router();
const locationController = new LocationController();

publicRouter.use("/translation", translationRouter);
publicRouter.get("/provinces", locationController.provinces);
publicRouter.get("/cities", locationController.cities);
publicRouter.use("/justice-inquiry", justiceInquiryRouter);

export default publicRouter;

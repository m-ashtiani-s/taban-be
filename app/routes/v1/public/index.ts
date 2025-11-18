import express from "express";
import LocationController from "../../../../shared/location/controller/location.controller";
import translationItemsRouter from "./translation/translation-items";
import translationRouter from "./translation";

const publicRouter = express.Router();
const locationController = new LocationController();

publicRouter.use("/translation", translationRouter);
publicRouter.get("/provinces", locationController.provinces);
publicRouter.get("/cities", locationController.cities);
// publicRouter.use("/products", productRoutes);

export default publicRouter;

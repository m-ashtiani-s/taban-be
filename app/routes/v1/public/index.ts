import express from "express";
import LocationController from "../../../../shared/location/controller/location.controller";

const publicRouter = express.Router();
const locationController = new LocationController();

publicRouter.get("/provinces", locationController.provinces);
publicRouter.get("/cities", locationController.cities);
// publicRouter.use("/products", productRoutes);

export default publicRouter;

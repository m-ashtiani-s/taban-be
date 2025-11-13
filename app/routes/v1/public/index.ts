import express from "express";
import LocationController from "../../../../shared/location/location.controller";

const publicRouter = express.Router();
const locationController = new LocationController();

publicRouter.get("/provinces", locationController.provinces);
// publicRouter.use("/products", productRoutes);

export default publicRouter;

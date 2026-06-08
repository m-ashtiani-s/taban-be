import express from "express";
import AdminShippingAddressController from "../../../../../modules/shippingAddress/controller/shippingAddress.admin.controller";
import AdminShippingAddressValidation from "../../../../../modules/shippingAddress/validation/shippingAddress.admin.validation";

const adminShippingAddressesRouter = express.Router();
const adminShippingAddressController = new AdminShippingAddressController();

adminShippingAddressesRouter.get(
	"/",
	AdminShippingAddressValidation.getShippingAddresses,
	adminShippingAddressController.getShippingAddresses
);
adminShippingAddressesRouter.get(
	"/:shippingAddressId",
	AdminShippingAddressValidation.shippingAddressId,
	adminShippingAddressController.getShippingAddressById
);
adminShippingAddressesRouter.put(
	"/:shippingAddressId",
	AdminShippingAddressValidation.shippingAddressId,
	AdminShippingAddressValidation.updateShippingAddress,
	adminShippingAddressController.updateShippingAddress
);
adminShippingAddressesRouter.put(
	"/:shippingAddressId/activate",
	AdminShippingAddressValidation.shippingAddressId,
	adminShippingAddressController.activateShippingAddress
);
adminShippingAddressesRouter.put(
	"/:shippingAddressId/deactivate",
	AdminShippingAddressValidation.shippingAddressId,
	adminShippingAddressController.deactivateShippingAddress
);

export default adminShippingAddressesRouter;

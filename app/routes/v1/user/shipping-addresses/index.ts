import express from "express";
import ShippingAddressController from "../../../../../modules/shippingAddress/controller/shippingAddress.controller";
import ShippingAddressValidation from "../../../../../modules/shippingAddress/validation/shippingAddress.validation";

const userShippingAddressesRouter = express.Router();
const shippingAddressController = new ShippingAddressController();

userShippingAddressesRouter.post(
	"/",
	ShippingAddressValidation.createShippingAddress,
	shippingAddressController.createShippingAddress
);
userShippingAddressesRouter.get(
	"/",
	ShippingAddressValidation.getShippingAddresses,
	shippingAddressController.getShippingAddresses
);
userShippingAddressesRouter.get(
	"/:shippingAddressId",
	ShippingAddressValidation.shippingAddressId,
	shippingAddressController.getShippingAddressById
);
userShippingAddressesRouter.put(
	"/:shippingAddressId",
	ShippingAddressValidation.shippingAddressId,
	ShippingAddressValidation.updateShippingAddress,
	shippingAddressController.updateShippingAddress
);
userShippingAddressesRouter.put(
	"/:shippingAddressId/activate",
	ShippingAddressValidation.shippingAddressId,
	shippingAddressController.activateShippingAddress
);
userShippingAddressesRouter.put(
	"/:shippingAddressId/deactivate",
	ShippingAddressValidation.shippingAddressId,
	shippingAddressController.deactivateShippingAddress
);

export default userShippingAddressesRouter;

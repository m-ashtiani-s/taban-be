import express from "express";
import AdminUserController from "../../../../../modules/user/controller/adminUser.controller";
import AdminUserValidation from "../../../../../modules/user/validation/adminUser.validation";

const adminUsersRouter = express.Router();
const adminUserController = new AdminUserController();

adminUsersRouter.get("/", AdminUserValidation.getUsers, adminUserController.getUsers);
adminUsersRouter.get("/:userId", AdminUserValidation.userId, adminUserController.getUserById);
adminUsersRouter.put(
	"/:userId",
	AdminUserValidation.userId,
	AdminUserValidation.updateUser,
	adminUserController.updateUser
);
adminUsersRouter.put("/:userId/activate", AdminUserValidation.userId, adminUserController.activateUser);
adminUsersRouter.put("/:userId/deactivate", AdminUserValidation.userId, adminUserController.deactivateUser);

export default adminUsersRouter;

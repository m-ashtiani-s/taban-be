import express from "express";
import AdminUserController from "../../../../../modules/user/controller/user.admin.controller";
import AdminUserValidation from "../../../../../modules/user/validation/user.admin.validation";
import requireRoles from "../../../../../middleware/auth/requireRoles.middleware";
import { UserRole } from "../../../../../modules/user/model/user.model";

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
adminUsersRouter.put(
	"/:userId/password",
	requireRoles(UserRole.ADMIN),
	AdminUserValidation.userId,
	AdminUserValidation.changeUserPassword,
	adminUserController.changeUserPassword
);
adminUsersRouter.put("/:userId/activate", AdminUserValidation.userId, adminUserController.activateUser);
adminUsersRouter.put("/:userId/deactivate", AdminUserValidation.userId, adminUserController.deactivateUser);

export default adminUsersRouter;

import express from "express";
import UserController from "../../../../modules/user/controller/user.controller";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/profile-completion", userController.profileCompletionStatus);
userRouter.put("/", userController.updateUser);
userRouter.get("/", userController.getUser);

// userRouter.use("/cart", cartRoutes);

export default userRouter;

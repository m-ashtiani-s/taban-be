import express from "express";
import AuthController from "../../../../modules/auth/controller/auth.controller";
import AuthValidation from "../../../../modules/auth/validation/auth.validation";
const authRouter = express.Router();
const authController = new AuthController();

authRouter.get("/check-username", AuthValidation.checkUsername, authController.checkUsername);
authRouter.post("/sign-up/otp/send", AuthValidation.sendOTP, authController.sendOTP);
authRouter.post("/sign-up/otp/check", AuthValidation.checkOTP, authController.checkOTP);
authRouter.post("/sign-up/set-password", AuthValidation.setPassword, authController.setPassword);
authRouter.post("/login", AuthValidation.login, authController.login);
authRouter.post("/login/otp/send", AuthValidation.sendOTP, authController.sendLoginOTP);
authRouter.post("/login/otp/check", AuthValidation.checkOTP, authController.loginWithOtp);
authRouter.post("/forget-password/otp/send", AuthValidation.sendOTP, authController.sendOTP);
authRouter.post("/forget-password/otp/check", AuthValidation.checkOTP, authController.checkOTP);
authRouter.post("/forget-password/set-password", AuthValidation.setPassword, authController.changePassword);

export default authRouter;

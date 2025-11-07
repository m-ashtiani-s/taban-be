import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import AuthService from "../service/auth.service";
import { ControllerError } from "../../../types/controllerError.type";
const authService = new AuthService();

export default class AuthController extends ControllerBase {
	checkUsername = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const result = await authService.checkUsername(req.query.username as string);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "checkUsername",
				success: false,
				data: null,
				message: error.message || "مشکلی در بررسی نام کاربری رخ داد",
			});
		}
	};

	sendOTP = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const username = req.body.username as string;
			const result = await authService.sendOtp(username);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "sendOTP",
				success: false,
				data: null,
				message: error.message || "مشکلی در ارسال کد تایید رخ داد",
			});
		}
	};
	checkOTP = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const username = req.body.username as string;
			const otp = +req.body.otp;
			const result = await authService.checkOtp(username, otp);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "checkOTP",
				success: false,
				data: null,
				message: error.message || "مشکلی در تایید کد تایید رخ داد",
			});
		}
	};
	setPassword = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const username = req.body.username as string;
			const password = req.body.password as string;
			const result = await authService.setPassword(username, password);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "setPassword",
				success: false,
				data: null,
				message: error.message || "مشکلی در تایید کد تایید رخ داد",
			});
		}
	};
	login = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const username = req.body.username as string;
			const password = req.body.password as string;
			const result = await authService.login(username, password);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "login",
				success: false,
				data: null,
				message: error.message || "مشکلی در ورود به حساب رخ داد",
			});
		}
	};
	changePassword = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const username = req.body.username as string;
			const password = req.body.password as string;
			const result = await authService.changePassword(username, password);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "changePassword",
				success: false,
				data: null,
				message: error.message || "مشکلی در تایید کد تایید رخ داد",
			});
		}
	};
}

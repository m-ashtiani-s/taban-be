import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import UserService from "../service/user.service";
import { UpdateUserRequestDto } from "../dto/updateUserRequest.dto";
const userService = new UserService();

export default class UserController extends ControllerBase {
	profileCompletionStatus = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const result = await userService.profileCompletionStatus(req.user?._id as string);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "profileCompletionStatus",
				success: false,
				data: null,
				message: error.message || "مشکلی در بررسی پروفایل رخ داد",
			});
		}
	};
	updateUser = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const updateUserData: UpdateUserRequestDto = {
				profilePic: req?.body?.profilePic ?? "",
				firstName: req?.body?.firstName ?? "",
				lastName: req?.body?.lastName ?? "",
				birthDate: req?.body?.birthDate ?? "",
				email: req?.body?.email ?? "",
				gender: req?.body?.gender ?? "",
				state: req?.body?.state ?? "",
				city: req?.body?.city ?? "",
				referralSource: req?.body?.referralSource ?? "",
			};
			const result = await userService.updateUser(req.user?._id as string, updateUserData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "profileCompletionStatus",
				success: false,
				data: null,
				message: error.message || "مشکلی در بررسی پروفایل رخ داد",
			});
		}
	};
}

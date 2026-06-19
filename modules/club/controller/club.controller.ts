import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import ClubService from "../service/club.service";

const clubService = new ClubService();

export default class ClubController extends ControllerBase {
	getConfig = async (req: Request, res: Response) => {
		try {
			const result = await clubService.getConfig();
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getClubConfig",
				success: false,
				data: null,
				message: error.message || "دریافت تنظیمات باشگاه با خطا مواجه شد",
			});
		}
	};

	getMyStatus = async (req: Request, res: Response) => {
		try {
			const result = await clubService.getMyStatus(req.user?._id as string);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getMyClubStatus",
				success: false,
				data: null,
				message: error.message || "دریافت وضعیت باشگاه با خطا مواجه شد",
			});
		}
	};

	getMyHistory = async (req: Request, res: Response) => {
		try {
			const page = (req.query.page as string) ?? "";
			const pageSize = (req.query.pageSize as string) ?? "";
			const sortOrders = (req.query.sortOrders as string) ?? "";
			const result = await clubService.getMyHistory(req.user?._id as string, page, pageSize, sortOrders);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getMyClubHistory",
				success: false,
				data: null,
				message: error.message || "دریافت تاریخچه‌ی امتیازها با خطا مواجه شد",
			});
		}
	};
}

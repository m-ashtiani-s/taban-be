import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import { ControllerError } from "../../../types/controllerError.type";
import EnterpriseCustomerService from "../service/enterpriseCustomer.service";

const enterpriseCustomerService = new EnterpriseCustomerService();

export default class EnterpriseCustomerController extends ControllerBase {
	register = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const result = await enterpriseCustomerService.register(req.user?._id as string, req.body);
			return res.status(201).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "registerEnterpriseCustomer",
				success: false,
				data: null,
				message: error.message || "ثبت درخواست مشتری سازمانی با خطا مواجه شد",
			});
		}
	};

	getMyEnterpriseProfile = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return this.showValidationErrors(res, errors);
		try {
			const result = await enterpriseCustomerService.getMyEnterpriseProfile(req.user?._id as string);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : error.name === "NotFoundError" ? 404 : 500;
			return res.status(statusCode).json({
				field: "getMyEnterpriseProfile",
				success: false,
				data: null,
				message: error.message || "دریافت اطلاعات مشتری سازمانی با خطا مواجه شد",
			});
		}
	};
}

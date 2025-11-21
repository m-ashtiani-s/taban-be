import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../../shared/base/controller.base";
import { ControllerError } from "../../../../types/controllerError.type";
import CertificationRateService from "../service/certificationRate.service";
import { GetCertificationRatesFilters } from "../dto/certificationRateFilters.dto";
import { CertificationRateUpdateDto } from "../dto/certificationRateUpdate.dto";
const certificationRateService = new CertificationRateService();

export default class CertificationRateAdminController extends ControllerBase {
	createCertificationRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = req.body.translationItemId;
			const languageId: string = req.body.languageId;
			const mfaPrice: number = req.body.mfaPrice;
			const justicePrice: number = req.body.justicePrice;
			const result = await certificationRateService.createCertificationRate(translationItemId, languageId, mfaPrice, justicePrice);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "createCertificationRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در ایجاد نرخ تاییدیه رخ داد",
			});
		}
	};
	getCertificationRates = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const translationItemId: string = (req.query.translationItemId as string) ?? undefined;
			const languageId: string = (req.query.languageId as string) ?? undefined;
			const filters: GetCertificationRatesFilters = {
				translationItemId,
				languageId,
			};
			const result = await certificationRateService.getCertificationRates(filters);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getCertificationRates",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ تاییدیه رخ داد",
			});
		}
	};
	getCertificationRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const certificationRateId: string = req.params.certificationRateId;
			const result = await certificationRateService.getCertificationRate(certificationRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "getCertificationRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در دریافت نرخ تاییدیه رخ داد",
			});
		}
	};
	deleteCertificationRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		try {
			const certificationRateId: string = req.params.certificationRateId;
			const result = await certificationRateService.deleteCertificationRate(certificationRateId);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "deleteCertificationRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در حذف نرخ تاییدیه رخ داد",
			});
		}
	};
	updateCertificationRate = async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		try {
			const certificationRateId: string = req.params.certificationRateId;
			const updateCertificationRateData: CertificationRateUpdateDto = {
				mfaPrice: req?.body?.mfaPrice ?? undefined,
				justicePrice: req?.body?.justicePrice ?? undefined
			};
			const result = await certificationRateService.updateCertificationRate(certificationRateId, updateCertificationRateData);
			return res.status(200).json(result);
		} catch (error: ControllerError) {
			const statusCode = error.name === "BadRequestError" ? 400 : 500;
			return res.status(statusCode).json({
				field: "updateCertificationRate",
				success: false,
				data: null,
				message: error.message || "مشکلی در ویرایش نرخ تاییدیه رخ داد",
			});
		}
	};
}

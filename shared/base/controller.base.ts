import { Result, ValidationError } from "express-validator";
import { Response } from "express";

export default class ControllerBase {
	showValidationErrors(res: Response, errors: Result<ValidationError>) {
		console.log(errors);
		const errorArray = errors.array().map((error) => ({
			//@ts-ignore //it is handeled in new version
			field: error?.path,
			message: error.msg,
		}));

		return res.status(400).json({
			field: "validation",
			success: false,
			data: null,
			message: errorArray,
		});
	}
}

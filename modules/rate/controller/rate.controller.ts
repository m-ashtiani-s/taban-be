import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ControllerBase from "../../../shared/base/controller.base";
import AuthService from "../service/rate.service";
import { ControllerError } from "../../../types/controllerError.type";
const authService = new AuthService();

export default class RateController extends ControllerBase {
	
}

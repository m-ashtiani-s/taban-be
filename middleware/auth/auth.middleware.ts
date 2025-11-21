import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import Config from "../../config/config";
import UserRepository from "../../modules/user/repository/user.repository";
const userRepository = new UserRepository();

const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const baseToken = req.headers["authorization"];
		const token = baseToken?.replace("Bearer ","")?.replace("bearer ","")

		if (!token || typeof token !== "string") {
			return res.status(401).json({
				field: "authentication",
				success: false,
				data: null,
				message: "عدم وجود دسترسی!",
			});
		}
		const decoded = jwt.verify(token, Config.secret) as jwt.JwtPayload;
		if (!decoded?.user_id) {
			return res.status(401).json({
				field: "authentication",
				success: false,
				data: null,
				message: "توکن نامعتبر است.",
			});
		}
		const user = await userRepository.findByUserId(decoded.user_id);
		if (!user) {
			return res.status(401).json({
				field: "authentication",
				success: false,
				data: null,
				message: "کاربری یافت نشد",
			});
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			field: "authentication",
			success: false,
			data: null,
			message: "کاربری یافت نشد",
		});
	}
};

export default AuthMiddleware;

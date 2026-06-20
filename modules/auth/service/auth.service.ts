import UserRepository from "../../user/repository/user.repository";
import { generateOtp } from "../../../shared/utils/generateOtp.util";
import { sendOtpSms } from "../../../shared/utils/kavenegar.util";
import OtpRepository from "../repository/otp.repository";
import { ObjectId } from "mongoose";
import { compare } from "bcryptjs";
import { BadRequestError } from "../../../shared/base/badRequestError.error";
import AuthTransform from "../transform/auth.transform";
import { UserRole } from "../../user/model/user.model";

export default class AuthService {
	private userRepository = new UserRepository();
	private otpRepository = new OtpRepository();

	async checkUsername(username: string) {
		const user = await this.userRepository.findByUsername(username);
		return {
			field: "checkUsername",
			success: true,
			data: !!user,
			message: user ? "نام کاربری وجود دارد" : "نام کاربری وجود ندارد",
		};
	}

	async sendOtp(username: string) {
		const existingOtp = await this.otpRepository.findByOtpId(username);
		const otpCode = generateOtp();
		const now = new Date();
		const expireTime = new Date(now.getTime() + 2 * 60 * 1000);

		if (existingOtp) {
			if (existingOtp.expireTime > now && !existingOtp?.approved) {
				throw new BadRequestError("کد تایید در ۲ دقیقه اخیر ارسال شده است. لطفاً بعداً تلاش کنید");
			}

			await this.otpRepository.updateOtp(existingOtp, {
				code: otpCode,
				expireTime,
				approved: false,
			});
		} else {
			await this.otpRepository.createOtp({
				otpId: username,
				code: otpCode,
				expireTime,
				approved: false,
			});
		}

		// try {
		// 	await sendOtpSms(username, otpCode);
		// } catch {
		// 	throw new BadRequestError("ارسال پیامک با خطا مواجه شد، لطفاً مجدداً تلاش کنید");
		// }

		return {
			field: "sendOTP",
			success: true,
			message: "کد تایید با موفقیت ارسال شد",
			data: null,
		};
	}
	async checkOtp(username: string, otpCode: number) {
		const existingOtp = await this.otpRepository.findByOtpId(username);
		const now = new Date();

		if (existingOtp) {
			if (existingOtp.expireTime < now) {
				throw new BadRequestError("زمان تایید شماره موبایل شما بسیار طولانی شده، مجددا تلاش کنید");
			}
			if (otpCode === existingOtp?.code) {
				await this.otpRepository.updateOtp(existingOtp, {
					approved: true,
				});
			} else {
				throw new BadRequestError("کد تایید صحیح نیست");
			}
		} else {
			throw new BadRequestError("کد تاییدی برای این کاربری ارسال نشده");
		}
		return {
			field: "sendOTP",
			success: true,
			message: "کد تایید با موفقیت تایید شد",
			data: null,
		};
	}
	async setPassword(username: string, password: string, referralCode?: string) {
		const existingOtp = await this.otpRepository.findByOtpId(username);
		const now = new Date();

		if (existingOtp) {
			const tenMin = new Date(existingOtp.expireTime.getTime() + 10 * 60000);
			if (tenMin < now) {
				throw new BadRequestError("مدت زمان زیادی از تایید شماره همراه گذشته، لطفا مجددا تلاش کنید");
			} else if (!existingOtp?.approved) {
				throw new BadRequestError("این شماره تایید نشده است");
			}
			const user = await this.userRepository.findByUsername(username);
			if (!!user) {
				throw new BadRequestError("این کاربری وجود دارد");
			}
			// اگر کد معرف وارد شده باشد، باید متعلق به یک کاربر موجود باشد؛ در غیر این صورت خطا می‌دهیم
			const normalizedReferralCode = referralCode?.trim().toUpperCase() || undefined;
			if (normalizedReferralCode) {
				const referrer = await this.userRepository.findByOwnReferralCode(normalizedReferralCode);
				if (!referrer) {
					throw new BadRequestError("کد معرف وارد شده معتبر نیست");
				}
			}
			// هر کاربر هنگام ساخت، یک کد معرفِ یکتا برای دعوت دیگران دریافت می‌کند
			const ownReferralCode = await this.userRepository.generateUniqueReferralCode();
			// سایر فیلدهای غیرالزامی از طریق default: null در اسکیما روی دیتابیس می‌نشینند
			const newUser = await this.userRepository.createUser({
				username: username,
				password: password,
				role: UserRole.USER,
				ownReferralCode,
				referralCode: normalizedReferralCode,
			});
			await this.otpRepository.deleteOtp(existingOtp);
			return {
				field: "setPassword",
				success: true,
				message: "کاربری با موفقیت ایجاد شد",
				data: new AuthTransform().login(newUser),
			};
		} else {
			throw new BadRequestError("کد تاییدی برای این کاربری ارسال نشده");
		}
	}
	async login(username: string, password: string) {
		const user = await this.userRepository.findByUsername(username);
		if (!user) {
			throw new BadRequestError("این کاربری وجود ندارد");
		}
		const isMatch = await compare(password, user.password);
		if (!isMatch) {
			throw new BadRequestError("رمز عبور نادرست است");
		}
		return {
			field: "setPassword",
			success: true,
			message: "ورود با موفقیت انجام شد",
			data: new AuthTransform().login(user),
		};
	}
	async changePassword(username: string, password: string) {
		const existingOtp = await this.otpRepository.findByOtpId(username);
		const now = new Date();

		if (existingOtp) {
			const tenMin = new Date(existingOtp.expireTime.getTime() + 10 * 60000);
			if (tenMin < now) {
				throw new BadRequestError("مدت زمان زیادی از تایید شماره همراه گذشته، لطفا مجددا تلاش کنید");
			} else if (!existingOtp?.approved) {
				throw new BadRequestError("این شماره تایید نشده است");
			}
			const user = await this.userRepository.findByUsername(username);
			if (!user) {
				throw new BadRequestError("این کاربری وجود ندارد");
			}
			await this.userRepository.updateUser(user, {
				password: password,
			});
			await this.otpRepository.deleteOtp(existingOtp);
		} else {
			throw new BadRequestError("کد تاییدی برای این کاربری ارسال نشده");
		}
		return {
			field: "changePassword",
			success: true,
			message: "رمز عبور با موفقیت ایجاد شد",
			data: null,
		};
	}
}

import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import { CreatePassportDto } from "../dto/passport.dto";
import { PassportFilters } from "../dto/passportFilters.dto";
import PassportRepository from "../repository/passport.repository";
import PassportTransform from "../transform/passport.transform";

export default class PassportService {
	private passportRepository = new PassportRepository();
	private passportTransform = new PassportTransform();

	async createPassport(userId: string, createPassportData: CreatePassportDto) {
		const passport = await this.passportRepository.create(userId, createPassportData);
		return {
			field: "createPassport",
			success: true,
			message: "پاسپورت با موفقیت ایجاد شد",
			data: this.passportTransform.passport(passport),
		};
	}

	async getPassports(userId: string, filters: PassportFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.passportRepository.findPaginatedByUser(userId, filters, pagination.getOptions());
		return {
			field: "getPassports",
			success: true,
			message: "لیست پاسپورت‌ها با موفقیت دریافت شد",
			data: this.passportTransform.paginatedPassports(paginated),
		};
	}

	async getPassportById(userId: string, passportId: string) {
		const passport = await this.passportRepository.findByIdAndUser(passportId, userId);
		if (!passport) throw new NotFoundError("پاسپورت یافت نشد");
		return {
			field: "getPassportById",
			success: true,
			message: "پاسپورت با موفقیت دریافت شد",
			data: this.passportTransform.passport(passport),
		};
	}

	async activatePassport(userId: string, passportId: string) {
		const passport = await this.passportRepository.findByIdAndUser(passportId, userId);
		if (!passport) throw new NotFoundError("پاسپورت یافت نشد");
		if (passport.isActive) throw new BadRequestError("پاسپورت از قبل فعال است");

		await this.passportRepository.setActiveStatusByUser(passportId, userId, true);
		return {
			field: "activatePassport",
			success: true,
			message: "پاسپورت با موفقیت فعال شد",
			data: null,
		};
	}

	async deactivatePassport(userId: string, passportId: string) {
		const passport = await this.passportRepository.findByIdAndUser(passportId, userId);
		if (!passport) throw new NotFoundError("پاسپورت یافت نشد");
		if (!passport.isActive) throw new BadRequestError("پاسپورت از قبل غیرفعال است");

		await this.passportRepository.setActiveStatusByUser(passportId, userId, false);
		return {
			field: "deactivatePassport",
			success: true,
			message: "پاسپورت با موفقیت غیرفعال شد",
			data: null,
		};
	}
}

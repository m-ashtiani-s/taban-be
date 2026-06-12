import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import { PassportFilters } from "../dto/passportFilters.dto";
import AdminPassportRepository from "../repository/passport.admin.repository";
import AdminPassportTransform from "../transform/passport.admin.transform";

export default class AdminPassportService {
	private passportRepository = new AdminPassportRepository();
	private passportTransform = new AdminPassportTransform();

	async getPassports(filters: PassportFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.passportRepository.findPaginated(filters, pagination.getOptions(), ["user"]);
		return {
			field: "getPassports",
			success: true,
			message: "لیست پاسپورت‌ها با موفقیت دریافت شد",
			data: this.passportTransform.paginatedPassports(paginated),
		};
	}

	async getPassportById(passportId: string) {
		const passport = await this.passportRepository.findById(passportId, ["user"]);
		if (!passport) throw new NotFoundError("پاسپورت یافت نشد");
		return {
			field: "getPassportById",
			success: true,
			message: "پاسپورت با موفقیت دریافت شد",
			data: this.passportTransform.passport(passport),
		};
	}

	async activatePassport(passportId: string) {
		const passport = await this.passportRepository.findById(passportId);
		if (!passport) throw new NotFoundError("پاسپورت یافت نشد");
		if (passport.isActive) throw new BadRequestError("پاسپورت از قبل فعال است");

		await this.passportRepository.setActiveStatus(passportId, true);
		return {
			field: "activatePassport",
			success: true,
			message: "پاسپورت با موفقیت فعال شد",
			data: null,
		};
	}

	async deactivatePassport(passportId: string) {
		const passport = await this.passportRepository.findById(passportId);
		if (!passport) throw new NotFoundError("پاسپورت یافت نشد");
		if (!passport.isActive) throw new BadRequestError("پاسپورت از قبل غیرفعال است");

		await this.passportRepository.setActiveStatus(passportId, false);
		return {
			field: "deactivatePassport",
			success: true,
			message: "پاسپورت با موفقیت غیرفعال شد",
			data: null,
		};
	}
}

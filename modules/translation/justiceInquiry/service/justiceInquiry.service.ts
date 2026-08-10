import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import OrderRepository from "../../../order/repository/order.repository";
import JusticeInquiryRateRepository from "../../justiceInquiryRate/repository/justiceInquiryRate.repository";
import { GetJusticeInquiryiesFilters } from "../dto/getJusticeInquiryFilters.dto";
import { JusticeInquiryUpdateDto } from "../dto/justiceInquiryUpdate.dto";
import JusticeInquiryRepository from "../repository/justiceInquiry.repository";
import JusticeInquiryTransform from "../transform/justiceInquiry.transform";

export default class JusticeInquiryService {
	private justiceInquiryRepository = new JusticeInquiryRepository();
	private justiceInquiryRateRepository = new JusticeInquiryRateRepository();
	private orderRepository = new OrderRepository();

	async createJusticeInquiry(justiceInquiryName: string, description: string) {
		const justiceInquiry = await this.justiceInquiryRepository.findJusticeInquiryByTitle(justiceInquiryName);
		if (justiceInquiry) {
			throw new BadRequestError("یک استعلام با این عنوان وجود دارد");
		}
		await this.justiceInquiryRepository.createJusticeInquiry({
			justiceInquiryName,
			description,
			isActive: true,
		});
		return {
			field: "createJusticeInquiry",
			success: true,
			message: "استعلام با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getJusticeInquiryies(filters: GetJusticeInquiryiesFilters) {
		const justiceInquiryies = await this.justiceInquiryRepository.findJusticeInquiryies(filters);
		if (!justiceInquiryies) {
			throw new BadRequestError("مشکلی در یافتن استعلام ها بوجود آمد");
		}
		return {
			field: "getJusticeInquiryies",
			success: true,
			message: "لیست استعلام ها با موفقیت دریافت شد",
			data: new JusticeInquiryTransform().justiceInquiryies(justiceInquiryies),
		};
	}
	async getJusticeInquiry(justiceInquiryId: string, isActive?: boolean) {
		const justiceInquiry = await this.justiceInquiryRepository.findOneJusticeInquiry(justiceInquiryId, isActive);
		if (!justiceInquiry) {
			throw new BadRequestError("مشکلی در یافتن استعلام بوجود آمد");
		}
		return {
			field: "getJusticeInquiry",
			success: true,
			message: "استعلام با موفقیت دریافت شد",
			data: new JusticeInquiryTransform().justiceInquiry(justiceInquiry),
		};
	}
	async activateJusticeInquiry(justiceInquiryId: string) {
		const justiceInquiry = await this.justiceInquiryRepository.findByJusticeInquiryId(justiceInquiryId);
		if (!justiceInquiry) {
			throw new BadRequestError("مشکلی در یافتن استعلام بوجود آمد");
		}
		await this.justiceInquiryRepository.updateJusticeInquiry(justiceInquiry, {
			isActive: true,
		});

		return {
			field: "activateJusticeInquiry",
			success: true,
			data: null,
			message: "استعلام با موفقیت فعال شد",
		};
	}
	async deactivateJusticeInquiry(justiceInquiryId: string) {
		const justiceInquiry = await this.justiceInquiryRepository.findByJusticeInquiryId(justiceInquiryId);
		if (!justiceInquiry) {
			throw new BadRequestError("مشکلی در یافتن استعلام بوجود آمد");
		}
		await this.justiceInquiryRepository.updateJusticeInquiry(justiceInquiry, {
			isActive: false,
		});

		return {
			field: "deactivateJusticeInquiry",
			success: true,
			data: null,
			message: "استعلام با موفقیت غیرفعال شد",
		};
	}
	async updateJusticeInquiry(justiceInquiryId: string, updateTjusticeInquiryData: JusticeInquiryUpdateDto) {
		const justiceInquiry = await this.justiceInquiryRepository.findByJusticeInquiryId(justiceInquiryId);
		if (!justiceInquiry) {
			throw new BadRequestError("مشکلی در یافتن استعلام بوجود آمد");
		}
		await this.justiceInquiryRepository.updateJusticeInquiry(justiceInquiry, {
			...updateTjusticeInquiryData,
		});

		return {
			field: "updateJusticeInquiry",
			success: true,
			data: null,
			message: "استعلام با موفقیت به روز شد",
		};
	}
	async deleteJusticeInquiry(justiceInquiryId: string) {
		const justiceInquiry = await this.justiceInquiryRepository.findByJusticeInquiryId(justiceInquiryId);
		if (!justiceInquiry) {
			throw new BadRequestError("مشکلی در یافتن استعلام بوجود آمد");
		}

		const [hasRate, hasOrder] = await Promise.all([
			this.justiceInquiryRateRepository.existsByJusticeInquiry(justiceInquiryId),
			this.orderRepository.existsByJusticeInquiryName(justiceInquiry.justiceInquiryName),
		]);

		if (hasRate || hasOrder) {
			throw new BadRequestError("این استعلام در نرخ‌ها یا سفارش‌ها استفاده شده و قابل حذف نیست");
		}

		await this.justiceInquiryRepository.deleteJusticeInquiry(justiceInquiry);

		return {
			field: "deleteJusticeInquiry",
			success: true,
			data: null,
			message: "استعلام با موفقیت حذف شد",
		};
	}
}

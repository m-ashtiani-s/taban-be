import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import { GetEmbassiesFilters } from "../dto/getEmbassyFilters.dto";
import { TembassyUpdateDto } from "../dto/embassyUpdateDto.type";
import EmbassyRepository from "../repositories/embassy.repository";
import EmbassyTransform from "../transform/embassy.transform";

export default class EmbassyService {
	private embassyRepository = new EmbassyRepository();

	async createEmbassy(title: string, description: string) {
		const embassy = await this.embassyRepository.findEmbassyByTitle(title);
		if (embassy) {
			throw new BadRequestError("یک سفارت با این عنوان وجود دارد");
		}
		await this.embassyRepository.createEmbassy({
			title,
			isActive: true,
			description,
		});
		return {
			field: "createEmbassy",
			success: true,
			message: "سفارت با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getEmbassies(filters: GetEmbassiesFilters) {
		const embassies = await this.embassyRepository.findEmbassies(filters,["category"]);
		if (!embassies) {
			throw new BadRequestError("مشکلی در یافتن سفارت ها بوجود آمد");
		}
		return {
			field: "getEmbassies",
			success: true,
			message: "لیست سفارت‌ها با موفقیت دریافت شد",
			data: new EmbassyTransform().embassies(embassies),
		};
	}
	async getEmbassy(embassyId: string, isActive?: boolean) {
		const embassy = await this.embassyRepository.findOneEmbassy(embassyId, isActive,[]);
		if (!embassy) {
			throw new BadRequestError("مشکلی در یافتن سفارت بوجود آمد");
		}
		return {
			field: "getEmbassy",
			success: true,
			message: "سفارت با موفقیت دریافت شد",
			data: new EmbassyTransform().embassy(embassy),
		};
	}
	async activateEmbassy(embassyId: string) {
		const embassy = await this.embassyRepository.findByEmbassyId(embassyId);
		if (!embassy) {
			throw new BadRequestError("مشکلی در یافتن سفارت بوجود آمد");
		}
		await this.embassyRepository.updateEmbassy(embassy, {
			isActive: true,
		});

		return {
			field: "activateEmbassy",
			success: true,
			data: null,
			message: "سفارت با موفقیت فعال شد",
		};
	}
	async deactivateEmbassy(embassyId: string) {
		const embassy = await this.embassyRepository.findByEmbassyId(embassyId);
		if (!embassy) {
			throw new BadRequestError("مشکلی در یافتن سفارت بوجود آمد");
		}
		await this.embassyRepository.updateEmbassy(embassy, {
			isActive: false,
		});

		return {
			field: "deactivateEmbassy",
			success: true,
			data: null,
			message: "سفارت با موفقیت غیرفعال شد",
		};
	}
	async updateEmbassy(embassyId: string, updateTembassyData: TembassyUpdateDto) {
		const embassy = await this.embassyRepository.findByEmbassyId(embassyId);
		if (!embassy) {
			throw new BadRequestError("مشکلی در یافتن سفارت بوجود آمد");
		}
		await this.embassyRepository.updateEmbassy(embassy, {
			...updateTembassyData,
		});

		return {
			field: "updateEmbassy",
			success: true,
			data: null,
			message: "سفارت با موفقیت به روز شد",
		};
	}
}

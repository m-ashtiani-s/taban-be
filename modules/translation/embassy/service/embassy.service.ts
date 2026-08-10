import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import OrderRepository from "../../../order/repository/order.repository";
import { EmbassyOrderDto } from "../../embassyOrder/dto/embassyOrder.dto";
import EmbassyOrderService from "../../embassyOrder/service/embassyOrder.service";
import EmbassyRateRepository from "../../embassyRate/repository/embassyRate.repository";
import { GetEmbassiesFilters } from "../dto/getEmbassyFilters.dto";
import { EmbassyUpdateDto } from "../dto/embassyUpdate.dto";
import EmbassyRepository from "../repository/embassy.repository";
import EmbassyTransform from "../transform/embassy.transform";

export default class EmbassyService {
	private embassyRepository = new EmbassyRepository();
	private embassyOrderService = new EmbassyOrderService();
	private embassyRateRepository = new EmbassyRateRepository();
	private orderRepository = new OrderRepository();

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
		const embassies = await this.embassyRepository.findEmbassies(filters,[]);
		if (!embassies) {
			throw new BadRequestError("مشکلی در یافتن سفارت ها بوجود آمد");
		}
		const orderMap = await this.embassyOrderService.getOrderMap();
		return {
			field: "getEmbassies",
			success: true,
			message: "لیست سفارت‌ها با موفقیت دریافت شد",
			data: new EmbassyTransform().embassies(embassies, orderMap),
		};
	}
	async reorderEmbassies(orders: EmbassyOrderDto[]) {
		return this.embassyOrderService.setEmbassiesOrder(orders);
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
	async updateEmbassy(embassyId: string, updateTembassyData: EmbassyUpdateDto) {
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
	async deleteEmbassy(embassyId: string) {
		const embassy = await this.embassyRepository.findByEmbassyId(embassyId);
		if (!embassy) {
			throw new BadRequestError("مشکلی در یافتن سفارت بوجود آمد");
		}

		const [hasRate, hasOrder] = await Promise.all([
			this.embassyRateRepository.existsByEmbassy(embassyId),
			this.orderRepository.existsByEmbassyName(embassy.title),
		]);

		if (hasRate || hasOrder) {
			throw new BadRequestError("این سفارت در نرخ‌ها یا سفارش‌ها استفاده شده و قابل حذف نیست");
		}

		await this.embassyRepository.deleteEmbassy(embassy);
		await this.embassyOrderService.removeEmbassyOrder(embassyId);

		return {
			field: "deleteEmbassy",
			success: true,
			data: null,
			message: "سفارت با موفقیت حذف شد",
		};
	}
}

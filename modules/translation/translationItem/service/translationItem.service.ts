import { BadRequestError } from "../../../../shared/base/badRequestError.error";
import OrderRepository from "../../../order/repository/order.repository";
import BaseRateRepository from "../../baseRate/repository/baseRate.repository";
import CertificationRateRepository from "../../certificationRate/repository/certificationRate.repository";
import DynamicRateRepository from "../../dynamicRate/repository/dynamicRate.repository";
import EmbassyRateRepository from "../../embassyRate/repository/embassyRate.repository";
import JusticeInquiryRateRepository from "../../justiceInquiryRate/repository/justiceInquiryRate.repository";
import ScanRateRepository from "../../scanRate/repository/scanRate.repository";
import { TranslationItemOrderDto } from "../../translationItemOrder/dto/translationItemOrder.dto";
import TranslationItemOrderService from "../../translationItemOrder/service/translationItemOrder.service";
import { GetTranslationItemsFilters } from "../dto/getTranslationItemsFilters.dto";
import { TranslationItemUpdateDto } from "../dto/translationItemUpdate.dto";
import TranslationItemRepository from "../repository/translationItem.repository";
import TranslationTransform from "../transform/translationItem.transform";

export default class TranslationService {
	private translationItemRepository = new TranslationItemRepository();
	private translationItemOrderService = new TranslationItemOrderService();
	private baseRateRepository = new BaseRateRepository();
	private certificationRateRepository = new CertificationRateRepository();
	private dynamicRateRepository = new DynamicRateRepository();
	private scanRateRepository = new ScanRateRepository();
	private embassyRateRepository = new EmbassyRateRepository();
	private justiceInquiryRateRepository = new JusticeInquiryRateRepository();
	private orderRepository = new OrderRepository();

	async createTranslationItem(title: string, documentType: string, description: string, uploadDescription: string, namePlaceholder: string, categoryId: string, scoreMultiplier: number = 1) {
		const translationItem = await this.translationItemRepository.findTranslationItemByTitle(title);
		if (translationItem) {
			throw new BadRequestError("یک سند با این عنوان وجود دارد");
		}
		const translationItemByDocumentType = await this.translationItemRepository.findTranslationItemByDocumentType(documentType);
		if (translationItemByDocumentType) {
			throw new BadRequestError("یک سند با این نوع وجود دارد");
		}
		await this.translationItemRepository.createTranslationItem({
			title,
			category:categoryId,
			documentType,
			isActive: true,
			description,
			uploadDescription,
			namePlaceholder,
			scoreMultiplier,
		});
		return {
			field: "createTranslationItem",
			success: true,
			message: "سند با موفقیت ایجاد شد",
			data: null,
		};
	}
	async getTranslationItems(filters: GetTranslationItemsFilters) {
		const translationItems = await this.translationItemRepository.findTranslationItems(filters,["category"]);
		if (!translationItems) {
			throw new BadRequestError("مشکلی در یافتن سند ها بوجود آمد");
		}
		const orderMap = await this.translationItemOrderService.getOrderMap();
		return {
			field: "getTranslationItems",
			success: true,
			message: "لیست اسناد با موفقیت دریافت شد",
			data: new TranslationTransform().translationItems(translationItems, orderMap),
		};
	}
	async reorderTranslationItems(orders: TranslationItemOrderDto[]) {
		return this.translationItemOrderService.setTranslationItemsOrder(orders);
	}
	async getTranslationItem(translationItemId: string, isActive?: boolean) {
		const translationItem = await this.translationItemRepository.findOneTranslationItem(translationItemId, isActive,["category"]);
		if (!translationItem) {
			throw new BadRequestError("مشکلی در یافتن سند بوجود آمد");
		}
		return {
			field: "getTranslationItem",
			success: true,
			message: "سند با موفقیت دریافت شد",
			data: new TranslationTransform().translationItem(translationItem),
		};
	}
	async activateTranslationItem(translationItemId: string) {
		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new BadRequestError("مشکلی در یافتن مدرک بوجود آمد");
		}
		await this.translationItemRepository.updateTranslationItem(translationItem, {
			isActive: true,
		});

		return {
			field: "activateTranslationItem",
			success: true,
			data: null,
			message: "مدرک با موفقیت فعال شد",
		};
	}
	async deactivateTranslationItem(translationItemId: string) {
		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new BadRequestError("مشکلی در یافتن مدرک بوجود آمد");
		}
		await this.translationItemRepository.updateTranslationItem(translationItem, {
			isActive: false,
		});

		return {
			field: "deactivateTranslationItem",
			success: true,
			data: null,
			message: "مدرک با موفقیت غیرفعال شد",
		};
	}
	async updateTranslationItem(translationItemId: string, updateTtranslationItemData: TranslationItemUpdateDto) {
		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new BadRequestError("مشکلی در یافتن مدرک بوجود آمد");
		}
		await this.translationItemRepository.updateTranslationItem(translationItem, {
			...updateTtranslationItemData,
		});

		return {
			field: "updateTranslationItem",
			success: true,
			data: null,
			message: "مدرک با موفقیت به روز شد",
		};
	}
	async deleteTranslationItem(translationItemId: string) {
		const translationItem = await this.translationItemRepository.findByTranslationItemId(translationItemId);
		if (!translationItem) {
			throw new BadRequestError("مشکلی در یافتن مدرک بوجود آمد");
		}

		const [
			hasBaseRate,
			hasCertificationRate,
			hasDynamicRate,
			hasScanRate,
			hasEmbassyRate,
			hasJusticeInquiryRate,
			hasOrder,
		] = await Promise.all([
			this.baseRateRepository.existsByTranslationItem(translationItemId),
			this.certificationRateRepository.existsByTranslationItem(translationItemId),
			this.dynamicRateRepository.existsByTranslationItem(translationItemId),
			this.scanRateRepository.existsByTranslationItem(translationItemId),
			this.embassyRateRepository.existsByTranslationItem(translationItemId),
			this.justiceInquiryRateRepository.existsByTranslationItem(translationItemId),
			this.orderRepository.existsByTranslationItem(translationItemId),
		]);

		const hasRate = hasBaseRate || hasCertificationRate || hasDynamicRate || hasScanRate || hasEmbassyRate || hasJusticeInquiryRate;
		if (hasRate || hasOrder) {
			throw new BadRequestError("این مدرک در نرخ‌ها یا سفارش‌ها استفاده شده و قابل حذف نیست");
		}

		await this.translationItemRepository.deleteTranslationItem(translationItem);
		await this.translationItemOrderService.removeTranslationItemOrder(translationItemId);

		return {
			field: "deleteTranslationItem",
			success: true,
			data: null,
			message: "مدرک با موفقیت حذف شد",
		};
	}
}

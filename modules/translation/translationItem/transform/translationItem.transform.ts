import { TranslationItemDocument } from "../model/translationItem.model";
import { TranslationItemDto } from "../dto/translationItem.dto";
import { TranslationItemCategoryDocument } from "../../translationItemCategory/model/translationItemCategory.model";

export default class TranslationTransform {
	translationItem(translationItem: TranslationItemDocument): TranslationItemDto {
		const category = translationItem.category as TranslationItemCategoryDocument;

		const loginData: TranslationItemDto = {
			translationItemId: translationItem?._id as string,
			title: translationItem?.title,
			documentType: translationItem?.documentType,
			isActive: translationItem?.isActive,
			description: translationItem?.description,
			uploadDescription: translationItem?.uploadDescription ?? "",
			namePlaceholder: translationItem?.namePlaceholder ?? "",
			categoryId: (category?._id?.toString() || category?.toString()) ?? "",
			categoryName: category?.title ?? "",
			scoreMultiplier: translationItem?.scoreMultiplier ?? 1,
		};
		return loginData;
	}
	translationItems(translationItems: TranslationItemDocument[], orderMap: Record<string, number> = {}): TranslationItemDto[] {
		// مدارکی که ترتیب نمایش دارند اول (صعودی) و بی‌ترتیب‌ها انتها؛ sort پایدار است پس تساوی‌ها ترتیب اصلی را حفظ می‌کنند
		const sorted = [...(translationItems ?? [])].sort((a, b) => {
			const aOrder = orderMap[String(a?._id)] ?? Number.MAX_SAFE_INTEGER;
			const bOrder = orderMap[String(b?._id)] ?? Number.MAX_SAFE_INTEGER;
			return aOrder - bOrder;
		});
		return sorted.map((it) => this.translationItem(it));
	}
}

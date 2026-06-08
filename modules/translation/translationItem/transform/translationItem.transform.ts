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
			categoryId: (category?._id?.toString() || category?.toString()) ?? "",
			categoryName: category?.title ?? "",
		};
		return loginData;
	}
	translationItems(translationItems: TranslationItemDocument[]): TranslationItemDto[] {
		const transformedTranslationItems: TranslationItemDto[] = [];
		translationItems?.map((it) => {
			transformedTranslationItems.push(this.translationItem(it));
		});
		return transformedTranslationItems;
	}
}

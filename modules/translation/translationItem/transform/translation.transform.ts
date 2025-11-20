import { TranslationItemDocument } from "../model/translationItem.mode";
import { TranslationItemDto } from "../dto/translationItem.dto";

export default class TranslationTransform {
	translationItem(translationItem: TranslationItemDocument): TranslationItemDto {
		const loginData: TranslationItemDto = {
			translationItemId: translationItem?._id as string,
			title: translationItem?.title,
			documentType: translationItem?.documentType,
			isActive: translationItem?.isActive,
			description: translationItem?.description,
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

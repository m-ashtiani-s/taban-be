import { TranslationItemCategoryDocument } from "../model/translationItemCategory.mode";
import { TranslationItemCategoryDto } from "../dto/translationItemCategory.dto";

export default class TranslationTransform {
	translationItemCategory(translationItemCategory: TranslationItemCategoryDocument): TranslationItemCategoryDto {
		const loginData: TranslationItemCategoryDto = {
			translationItemCategoryId: translationItemCategory?._id as string,
			title: translationItemCategory?.title,
		};
		return loginData;
	}
	translationItemCategories(translationItemCategories: TranslationItemCategoryDocument[]): TranslationItemCategoryDto[] {
		const transformedTranslationItemCategories: TranslationItemCategoryDto[] = [];
		translationItemCategories?.map((it) => {
			transformedTranslationItemCategories.push(this.translationItemCategory(it));
		});
		return transformedTranslationItemCategories;
	}
}

import { DynamicRateInputType } from "./dynamicRateInputType.dto";
import { DynamicRateOption } from "./dynamicRateOption.dto";

export interface DynamicRateDto {
	translationItemId: string;
	translationItemName: string;
	languageId: string;
	languageName: string;
	price: number;
	inputType: DynamicRateInputType;
	options: DynamicRateOption[];
	isActive: boolean;
}

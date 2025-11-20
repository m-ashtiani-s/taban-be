import { DynamicRateInputType } from "./dynamicRateInputType.dto";
import { DynamicRateOption } from "./dynamicRateOption.dto";

export interface DynamicRateDto {
	dynamicRateId: string;
	translationItemId: string;
	translationItemName: string;
	languageId: string;
	languageName: string;
	price: number;
	inputType: DynamicRateInputType;
	options: DynamicRateOption[];
}

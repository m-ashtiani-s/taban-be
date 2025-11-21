import { DynamicRateInputType } from "./dynamicRateInputType.dto";
import { DynamicRateOption } from "./dynamicRateOption.dto";

export interface DynamicRateUpdateDto {
	price: number;
	label: string;
	inputType: DynamicRateInputType;
	options: DynamicRateOption[];
}

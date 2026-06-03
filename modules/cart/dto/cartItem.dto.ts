import { RateCalculationRequestDto, RateCalculationResponseDto } from "../../rateCalculator/dto/rateCalculation.dto";

export type AddDocumentToCartDto = RateCalculationRequestDto & {
	passports?: string[];
	assets?: string[];
	customerId?: string | null;
};

export interface CartItemDto {
	cartItemId: string;
	payload: AddDocumentToCartDto;
	breakdown: RateCalculationResponseDto;
}

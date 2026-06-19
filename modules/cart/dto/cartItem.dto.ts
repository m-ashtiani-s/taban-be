import { RateCalculationRequestDto, RateCalculationResponseDto } from "../../rateCalculator/dto/rateCalculation.dto";

export type AddDocumentToCartDto = RateCalculationRequestDto & {
	passports?: string[];
	assets?: string[];
	customerId?: string | null;
	// تاریخ تحویل دلخواهِ کاربر (اختیاری) — صرفاً برای پیگیری توسط کارشناسان، روی قیمت اثری ندارد
	desiredDeliveryDate?: string | null;
	// isOfficial از RateCalculationRequestDto به ارث می‌رسد
};

export interface CartItemDto {
	cartItemId: string;
	payload: AddDocumentToCartDto;
	breakdown: RateCalculationResponseDto;
}

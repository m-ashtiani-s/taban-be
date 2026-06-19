import { TranslationItemDocument } from "../../translationItem/model/translationItem.model";
import { ScanRateDto } from "../dto/scanRate.dto";
import { ScanRateDocument } from "../model/scanRate.model";

export default class ScanRateTransform {
	scanRate(scanRate: ScanRateDocument): ScanRateDto {
		const translationItem = scanRate.translationItem as TranslationItemDocument;
		return {
			scanRateId: scanRate._id as string,
			translationItemId: translationItem._id?.toString() || translationItem.toString(),
			translationItemName: translationItem.title || "",
			translationItemIsActive: translationItem.isActive,
			price: scanRate.price,
		};
	}

	scanRates(scanRates: ScanRateDocument[]): ScanRateDto[] {
		const transformed: ScanRateDto[] = [];
		scanRates.forEach((it) => {
			const dto = this.scanRate(it);
			if (dto.translationItemIsActive) {
				transformed.push(dto);
			}
		});
		return transformed;
	}
}

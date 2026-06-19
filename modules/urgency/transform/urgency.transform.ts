import { UrgencyDto } from "../dto/urgency.dto";
import { UrgencySettingDocument } from "../model/urgency.model";

export default class UrgencyTransform {
	urgency(doc: UrgencySettingDocument): UrgencyDto {
		return {
			translationMinDays: doc.translationMinDays,
			translationMaxDays: doc.translationMaxDays,
			justiceMinDays: doc.justiceMinDays,
			justiceMaxDays: doc.justiceMaxDays,
			mfaMinDays: doc.mfaMinDays,
			mfaMaxDays: doc.mfaMaxDays,
			updatedAt: doc.updatedAt,
		};
	}
}

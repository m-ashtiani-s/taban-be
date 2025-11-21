import { JusticeInquiryDto } from "../dto/justiceInquiry.dto";
import { JusticeInquiryDocument } from "../model/justiceInquiry.mode";


export default class TranslationTransform {
	justiceInquiry(justiceInquiry: JusticeInquiryDocument): JusticeInquiryDto {
		const loginData: JusticeInquiryDto = {
			justiceInquiryId: justiceInquiry?._id as string,
			justiceInquiryName: justiceInquiry?.justiceInquiryName,
			description: justiceInquiry?.description,
			isActive: justiceInquiry?.isActive,
		};
		return loginData;
	}
	justiceInquiryies(justiceInquiryies: JusticeInquiryDocument[]): JusticeInquiryDto[] {
		const transformedJusticeInquiryies: JusticeInquiryDto[] = [];
		justiceInquiryies?.map((it) => {
			transformedJusticeInquiryies.push(this.justiceInquiry(it));
		});
		return transformedJusticeInquiryies;
	}
}

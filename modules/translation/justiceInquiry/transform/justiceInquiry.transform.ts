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
	justiceInquirys(justiceInquirys: JusticeInquiryDocument[]): JusticeInquiryDto[] {
		const transformedJusticeInquirys: JusticeInquiryDto[] = [];
		justiceInquirys?.map((it) => {
			transformedJusticeInquirys.push(this.justiceInquiry(it));
		});
		return transformedJusticeInquirys;
	}
}

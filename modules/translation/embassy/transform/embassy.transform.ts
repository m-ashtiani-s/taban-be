import { EmbassyDocument } from "../model/embassy.mode";
import { EmbassyDto } from "../dto/embassy.dto";
import { EmbassyCategoryDocument } from "../../embassyCategory/model/embassyCategory.mode";

export default class EmbassyTransform {
	embassy(embassy: EmbassyDocument): EmbassyDto {
		const category = embassy.category as EmbassyCategoryDocument;

		const loginData: EmbassyDto = {
			embassyId: embassy?._id as string,
			title: embassy?.title,
			documentType: embassy?.documentType,
			isActive: embassy?.isActive,
			description: embassy?.description,
			categoryId: (category?._id?.toString() || category?.toString()) ?? "",
			categoryName: category?.title ?? "",
		};
		return loginData;
	}
	embassies(embassies: EmbassyDocument[]): EmbassyDto[] {
		const transformedEmbassies: EmbassyDto[] = [];
		embassies?.map((it) => {
			transformedEmbassies.push(this.embassy(it));
		});
		return transformedEmbassies;
	}
}

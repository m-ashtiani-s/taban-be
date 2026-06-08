import { EmbassyDocument } from "../model/embassy.model";
import { EmbassyDto } from "../dto/embassy.dto";

export default class EmbassyTransform {
	embassy(embassy: EmbassyDocument): EmbassyDto {

		const loginData: EmbassyDto = {
			embassyId: embassy?._id as string,
			title: embassy?.title,
			isActive: embassy?.isActive,
			description: embassy?.description,
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

import { PaginationResult } from "../../../shared/utils/pagination.util";
import { PassportDto } from "../dto/passport.dto";
import { PassportDocument } from "../model/passport.model";

export default class PassportTransform {
	passport(doc: PassportDocument): PassportDto {
		return {
			passportId: (doc._id as any)?.toString() ?? "",
			title: doc.title,
			image: doc.image,
			isActive: doc.isActive,
			user: (doc.user as any)?.toString?.() ?? null,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	}

	passports(docs: PassportDocument[]): PassportDto[] {
		return docs.map((d) => this.passport(d));
	}

	paginatedPassports(paginated: PaginationResult<PassportDocument>) {
		return {
			...paginated,
			elements: paginated.elements.map((item) => this.passport(item)),
		};
	}
}

import { PaginationResult } from "../../../shared/utils/pagination.util";
import { UserDocument } from "../../user/model/user.model";
import { PassportDto, PassportUserInfo } from "../dto/passport.dto";
import { PassportDocument } from "../model/passport.model";

export default class AdminPassportTransform {
	private user(user: any): PassportUserInfo | string | null {
		if (!user) return null;
		if (typeof user === "object" && user?._id) {
			const u = user as UserDocument;
			return {
				userId: (u._id as any)?.toString() ?? "",
				fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
				username: u.username ?? "",
				phoneNumber: u.phoneNumber ?? "",
			};
		}
		return user?.toString?.() ?? user;
	}

	passport(doc: PassportDocument): PassportDto {
		return {
			passportId: (doc._id as any)?.toString() ?? "",
			title: doc.title,
			image: doc.image,
			isActive: doc.isActive,
			user: this.user(doc.user),
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

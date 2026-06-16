import { PaginationResult } from "../../../shared/utils/pagination.util";
import { UserDocument } from "../../user/model/user.model";
import { ShippingAddressDto, ShippingAddressUserInfo } from "../dto/shippingAddress.dto";
import { ShippingAddressDocument } from "../model/shippingAddress.model";

export default class AdminShippingAddressTransform {
	private user(user: any): ShippingAddressUserInfo | string | null {
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

	shippingAddress(doc: ShippingAddressDocument): ShippingAddressDto {
		return {
			shippingAddressId: (doc._id as any)?.toString() ?? "",
			title: doc.title,
			provinceName: doc.provinceName,
			provinceCode: doc.provinceCode,
			cityName: doc.cityName,
			cityCode: doc.cityCode,
			postalCode: doc.postalCode,
			plaque: doc.plaque ?? null,
			unit: doc.unit ?? null,
			fullAddress: doc.fullAddress,
			addressDescription: doc.addressDescription ?? null,
			landlineNumber: doc.landlineNumber ?? null,
			isActive: doc.isActive,
			user: this.user(doc.user),
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	}

	shippingAddresses(docs: ShippingAddressDocument[]): ShippingAddressDto[] {
		return docs.map((d) => this.shippingAddress(d));
	}

	paginatedShippingAddresses(paginated: PaginationResult<ShippingAddressDocument>) {
		return {
			...paginated,
			elements: paginated.elements.map((item) => this.shippingAddress(item)),
		};
	}
}

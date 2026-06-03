import { PaginationResult } from "../../../shared/utils/pagination.util";
import { ShippingAddressDto } from "../dto/shippingAddress.dto";
import { ShippingAddressDocument } from "../model/shippingAddress.model";

export default class ShippingAddressTransform {
	shippingAddress(doc: ShippingAddressDocument): ShippingAddressDto {
		return {
			shippingAddressId: (doc._id as any)?.toString() ?? "",
			title: doc.title,
			provinceName: doc.provinceName,
			provinceCode: doc.provinceCode,
			cityName: doc.cityName,
			cityCode: doc.cityCode,
			plaque: doc.plaque ?? null,
			unit: doc.unit ?? null,
			fullAddress: doc.fullAddress,
			addressDescription: doc.addressDescription ?? null,
			landlineNumber: doc.landlineNumber ?? null,
			isActive: doc.isActive,
			user: (doc.user as any)?.toString?.() ?? null,
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

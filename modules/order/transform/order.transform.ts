import { PaginationResult } from "../../../shared/utils/pagination.util";
import {
	OrderCouponInfo,
	OrderCustomerInfo,
	OrderDto,
	OrderShippingAddressInfo,
} from "../dto/order.dto";
import { OrderDocument } from "../model/order.model";

export default class OrderTransform {
	protected shippingAddress(addr: any): OrderShippingAddressInfo | string | null {
		if (!addr) return null;
		if (typeof addr === "object" && addr?._id) {
			return {
				shippingAddressId: (addr._id as any)?.toString() ?? "",
				title: addr.title ?? "",
				provinceName: addr.provinceName ?? "",
				cityName: addr.cityName ?? "",
				fullAddress: addr.fullAddress ?? "",
				plaque: addr.plaque ?? null,
				unit: addr.unit ?? null,
				landlineNumber: addr.landlineNumber ?? null,
				addressDescription: addr.addressDescription ?? null,
			};
		}
		return addr?.toString?.() ?? addr;
	}

	protected customer(customer: any): OrderCustomerInfo | string | null {
		if (!customer) return null;
		if (typeof customer === "object" && customer?._id) {
			return {
				customerId: (customer._id as any)?.toString() ?? "",
				fullName: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
				nationalId: customer.nationalId ?? "",
				phoneNumber: customer.phoneNumber ?? "",
				provinceName: customer.provinceName ?? "",
				cityName: customer.cityName ?? "",
			};
		}
		return customer?.toString?.() ?? customer;
	}

	protected coupon(coupon: any): OrderCouponInfo | string | null {
		if (!coupon) return null;
		if (typeof coupon === "object" && coupon?._id) {
			return {
				couponId: (coupon._id as any)?.toString() ?? "",
				code: coupon.code ?? "",
			};
		}
		return coupon?.toString?.() ?? coupon;
	}

	/**
	 * هر مدرکِ هر آیتم سفارش را با فیلد `translationTotal` (نرخ پایه + ویژگی‌های داینامیک)
	 * غنی می‌کند تا فرانت بتواند آن را به‌عنوان یک قلم واحد «هزینه ترجمه» نمایش دهد. این کار
	 * در زمان خواندن انجام می‌شود تا سفارش‌های قدیمی هم بدون نیاز به مهاجرت داده پوشش داده شوند.
	 */
	protected enrichOrderedDocs(orderedDocs: OrderDocument["orderedDocs"]): OrderDocument["orderedDocs"] {
		return (orderedDocs ?? []).map((item) => ({
			...item,
			breakdown: {
				...item.breakdown,
				documents: (item.breakdown?.documents ?? []).map((d) => ({
					...d,
					translationTotal: (d?.base?.total ?? 0) + (d?.specialsTotal ?? 0),
				})),
			},
		}));
	}

	order(doc: OrderDocument): OrderDto {
		return {
			orderId: (doc._id as any)?.toString() ?? "",
			orderNumber: doc.orderNumber,
			user: (doc.user as any)?.toString?.() ?? null,
			customer: this.customer(doc.customer),
			orderedDocs: this.enrichOrderedDocs(doc.orderedDocs),
			coupon: this.coupon(doc.coupon),
			discountAmount: doc.discountAmount ?? 0,
			totalAmount: doc.totalAmount ?? 0,
			shippingAddress: this.shippingAddress(doc.shippingAddress),
			status: doc.status,
			rejectedRemarks: doc.rejectedRemarks ?? null,
			paymentStatus: doc.paymentStatus ?? "pending",
			finalAmount: doc.finalAmount ?? 0,
			remarks: doc.remarks ?? "",
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	}

	orders(docs: OrderDocument[]): OrderDto[] {
		return docs.map((d) => this.order(d));
	}

	paginatedOrders(paginated: PaginationResult<OrderDocument>) {
		return {
			...paginated,
			elements: paginated.elements.map((item) => this.order(item)),
		};
	}
}

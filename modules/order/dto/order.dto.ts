import { AddDocumentToCartDto } from "../../cart/dto/cartItem.dto";
import { OrderedDoc, OrderStatus, PaymentStatus } from "../model/order.model";
import { CustomerType } from "../../user/model/user.model";

export interface CreateOrderDto {
	shippingAddressId: string;
	remarks?: string;
}

export interface UpdateOrderItemDto extends AddDocumentToCartDto {}

export interface UpdateOrderStatusDto {
	status: OrderStatus;
	rejectedRemarks?: string | null;
}

export interface OrderFilters {
	term?: string;
	status?: OrderStatus;
	paymentStatus?: PaymentStatus;
	dateFrom?: string;
	dateTo?: string;
	userId?: string;
	customerId?: string;
}

export interface OrderCustomerInfo {
	customerId: string;
	fullName: string;
	nationalId: string;
	phoneNumber: string;
	provinceName: string;
	cityName: string;
}

export interface OrderUserInfo {
	userId: string;
	fullName: string;
	username: string;
	phoneNumber: string;
	customerType: CustomerType;
}

export interface OrderShippingAddressInfo {
	shippingAddressId: string;
	title: string;
	provinceName: string;
	cityName: string;
	fullAddress: string;
	plaque: string | null;
	unit: string | null;
	landlineNumber: string | null;
	addressDescription: string | null;
}

export interface OrderCouponInfo {
	couponId: string;
	code: string;
}

export interface OrderDto {
	orderId: string;
	orderNumber: number;
	user: OrderUserInfo | string | null;
	customer: OrderCustomerInfo | string | null;
	orderedDocs: OrderedDoc[];
	coupon: OrderCouponInfo | string | null;
	discountAmount: number;
	totalAmount: number;
	shippingAddress: OrderShippingAddressInfo | string | null;
	status: OrderStatus;
	rejectedRemarks: string | null;
	paymentStatus: PaymentStatus;
	finalAmount: number;
	remarks: string;
	createdAt: Date;
	updatedAt: Date;
}

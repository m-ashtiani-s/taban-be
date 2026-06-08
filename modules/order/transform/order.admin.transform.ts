import { UserDocument, CustomerType } from "../../user/model/user.model";
import { OrderDto, OrderUserInfo } from "../dto/order.dto";
import { OrderDocument } from "../model/order.model";
import OrderTransform from "./order.transform";

export default class AdminOrderTransform extends OrderTransform {
	private user(user: any): OrderUserInfo | string | null {
		if (!user) return null;
		if (typeof user === "object" && user?._id) {
			const u = user as UserDocument;
			return {
				userId: (u._id as any)?.toString() ?? "",
				fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
				username: u.username ?? "",
				phoneNumber: u.phoneNumber ?? "",
				customerType: u.customerType ?? CustomerType.NORMAL,
			};
		}
		return user?.toString?.() ?? user;
	}

	order(doc: OrderDocument): OrderDto {
		return {
			...super.order(doc),
			user: this.user(doc.user),
		};
	}
}

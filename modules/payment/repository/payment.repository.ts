import mongoose from "mongoose";
import PaymentModel, { PaymentDocument, PaymentStatus } from "../model/payment.model";

export default class PaymentRepository {
	async create(data: Partial<PaymentDocument>, session?: mongoose.ClientSession): Promise<PaymentDocument> {
		const payment = new PaymentModel(data);
		return payment.save({ session });
	}

	async findById(paymentId: string): Promise<PaymentDocument | null> {
		return PaymentModel.findById(paymentId).exec();
	}

	// برای callback: پرداخت را با authority پیدا می‌کنیم (بدون احراز هویت کاربر).
	async findByAuthority(authority: string): Promise<PaymentDocument | null> {
		return PaymentModel.findOne({ authority }).exec();
	}

	async findPaidByOrder(orderId: string): Promise<PaymentDocument | null> {
		return PaymentModel.findOne({ order: orderId, status: PaymentStatus.PAID }).exec();
	}

	async update(paymentId: string, data: Partial<PaymentDocument>, session?: mongoose.ClientSession): Promise<PaymentDocument | null> {
		let query = PaymentModel.findByIdAndUpdate(paymentId, { $set: data }, { new: true });
		if (session) query = query.session(session);
		return query.exec();
	}
}

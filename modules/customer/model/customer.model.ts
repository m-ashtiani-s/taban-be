import mongoose, { Document, ObjectId, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface Customer {
	enterprise: ObjectId | string;
	firstName: string;
	lastName: string;
	nationalId: string;
	phoneNumber: string;
	provinceName: string;
	provinceCode: number;
	cityName: string;
	cityCode: number;
	isActive: boolean;
}

export interface CustomerDocument extends Customer, Document {
	createdAt: Date;
	updatedAt: Date;
}

const customerSchema = new Schema(
	{
		enterprise: { type: Schema.Types.ObjectId, ref: "User", required: true },
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
		nationalId: { type: String, required: true, trim: true },
		phoneNumber: { type: String, required: true, trim: true },
		provinceName: { type: String, required: true, trim: true },
		provinceCode: { type: Number, required: true },
		cityName: { type: String, required: true, trim: true },
		cityCode: { type: Number, required: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

customerSchema.index({ enterprise: 1, isActive: 1 });

customerSchema.plugin(mongoosePaginate);

const CustomerModel = mongoose.model<CustomerDocument, PaginateModel<CustomerDocument>>("Customer", customerSchema);

export default CustomerModel;

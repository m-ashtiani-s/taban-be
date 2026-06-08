import mongoose, { Document, ObjectId, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ShippingAddress {
	title: string;
	provinceName: string;
	provinceCode: number;
	cityName: string;
	cityCode: number;
	plaque: string | null;
	unit: string | null;
	fullAddress: string;
	addressDescription: string | null;
	landlineNumber: string | null;
	isActive: boolean;
	user: ObjectId | string;
}

export interface ShippingAddressDocument extends ShippingAddress, Document {
	createdAt: Date;
	updatedAt: Date;
}

const shippingAddressSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		provinceName: { type: String, required: true, trim: true },
		provinceCode: { type: Number, required: true },
		cityName: { type: String, required: true, trim: true },
		cityCode: { type: Number, required: true },
		plaque: { type: String, default: null, trim: true },
		unit: { type: String, default: null, trim: true },
		fullAddress: { type: String, required: true, trim: true },
		addressDescription: { type: String, default: null, trim: true },
		landlineNumber: { type: String, default: null, trim: true },
		isActive: { type: Boolean, default: true },
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

shippingAddressSchema.index({ user: 1, isActive: 1 });
shippingAddressSchema.index({ provinceCode: 1, cityCode: 1 });
shippingAddressSchema.plugin(mongoosePaginate);

const ShippingAddressModel = mongoose.model<ShippingAddressDocument, PaginateModel<ShippingAddressDocument>>(
	"ShippingAddress",
	shippingAddressSchema
);

export default ShippingAddressModel;

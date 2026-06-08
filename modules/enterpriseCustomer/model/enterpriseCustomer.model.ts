import mongoose, { Document, ObjectId, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface EnterpriseCustomer {
	user: ObjectId | string;
	institutionName: string;
	institutionAddress: string;
	registrationId: string | null;
	isActive: boolean;
}

export interface EnterpriseCustomerDocument extends EnterpriseCustomer, Document {
	createdAt: Date;
	updatedAt: Date;
}

const enterpriseCustomerSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
		institutionName: { type: String, required: true, trim: true },
		institutionAddress: { type: String, required: true, trim: true },
		registrationId: { type: String, default: null, trim: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

enterpriseCustomerSchema.plugin(mongoosePaginate);

const EnterpriseCustomerModel = mongoose.model<EnterpriseCustomerDocument, PaginateModel<EnterpriseCustomerDocument>>(
	"EnterpriseCustomer",
	enterpriseCustomerSchema
);

export default EnterpriseCustomerModel;

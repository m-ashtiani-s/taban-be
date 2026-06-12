import mongoose, { Document, ObjectId, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface Passport {
	title: string;
	image: string;
	isActive: boolean;
	user: ObjectId | string;
}

export interface PassportDocument extends Passport, Document {
	createdAt: Date;
	updatedAt: Date;
}

const passportSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		image: { type: String, required: true, trim: true },
		isActive: { type: Boolean, default: true },
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

passportSchema.index({ user: 1, isActive: 1 });
passportSchema.plugin(mongoosePaginate);

const PassportModel = mongoose.model<PassportDocument, PaginateModel<PassportDocument>>("Passport", passportSchema);

export default PassportModel;

import mongoose, { Model, Schema, Document } from "mongoose";

export interface Embassy {
	title: string;
	isActive: boolean;
	description: string;
}

export type EmbassyDocument = Embassy & Document;

const embassySchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		description: {
			type: String,
			default: "",
			trim: true,
		},
	},
	{ timestamps: true },
);

const EmbassyModel: Model<EmbassyDocument> = mongoose.model<EmbassyDocument>("Embassy", embassySchema);

export default EmbassyModel;

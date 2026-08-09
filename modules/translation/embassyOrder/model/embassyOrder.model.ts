import mongoose, { Model, Schema, Document } from "mongoose";
import { EmbassyDocument } from "../../embassy/model/embassy.model";

export interface EmbassyOrder {
	embassy: string | EmbassyDocument;
	order: number;
}

export type EmbassyOrderDocument = EmbassyOrder & Document;

const embassyOrderSchema = new Schema(
	{
		embassy: { type: Schema.Types.ObjectId, ref: "Embassy", required: true, unique: true },
		order: { type: Number, required: true },
	},
	{ timestamps: true },
);

const EmbassyOrderModel: Model<EmbassyOrderDocument> = mongoose.model<EmbassyOrderDocument>(
	"EmbassyOrder",
	embassyOrderSchema,
);

export default EmbassyOrderModel;

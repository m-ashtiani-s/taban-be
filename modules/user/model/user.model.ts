import mongoose, { Document, Model, PaginateModel } from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

export interface User {
	name: string;
	username: string;
	role: string;
	password: string;
	profilePic?: string;
	isActive: boolean;
}

export interface UserDocument extends User, Document {}


const userSchema = new mongoose.Schema(
	{
		name: String,
		username: {
			type: String,
			unique: true,
			required: true,
		},
		role: {
			type: String,
			required: true,
			default: "USER",
		},
		password: String,
		profilePic: String,
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", function (next) {
	const user = this as UserDocument;

	if (!user.isModified("password")) return next();

	bcrypt.hash(user.password, 10, (err, hash) => {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

userSchema.plugin(mongoosePaginate);
const userModel = mongoose.model<UserDocument, PaginateModel<UserDocument>>("user", userSchema);

export default userModel;

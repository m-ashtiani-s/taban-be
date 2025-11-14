import mongoose, { Document, Model, PaginateModel } from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

export interface User {
	username: string;
	role: string;
	password: string;
	profilePic?: string;
	isActive: boolean;
	nationalId?: string;
	firstName?: string;
	lastName?: string;
	birthDate?: string;
	email?: string;
	gender?: string;
	province?: number;
	city?: number;
	referralSource?: string;
}

export interface UserDocument extends User, Document {}

const userSchema = new mongoose.Schema(
	{
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
		nationalId: {
			type: String,
			required: false,
		},
		firstName: {
			type: String,
			required: false,
		},
		lastName: {
			type: String,
			required: false,
		},
		birthDate: {
			type: String,
			required: false,
		},
		email: {
			type: String,
			required: false,
		},
		gender: {
			type: String,
			required: false,
		},
		province: {
			type: Number,
			required: false,
		},
		city: {
			type: Number,
			required: false,
		},
		referralSource: {
			type: String,
			required: false,
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

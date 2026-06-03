import mongoose, { Document, Model, PaginateModel } from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";
import { LanguageDocument } from "../../translation/language/model/translationItem.mode";

export type UserType = "individual" | "legal";
export type CustomerType = "NORMAL" | "ENTERPRISE";

export interface User {
	username: string;
	role: string;
	password: string;
	profilePic?: string;
	isActive: boolean;
	customerType: CustomerType;
	nationalId?: string;
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	userType?: UserType;
	requiredLanguages?: (string | LanguageDocument)[];
	specialtyField?: string;
	referralSource?: string;
	referralCode?: string;
	ownReferralCode?: string;
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
		profilePic: {
			type: String,
			required: false,
			default: null,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
		customerType: {
			type: String,
			enum: ["NORMAL", "ENTERPRISE"],
			required: true,
			default: "NORMAL",
		},
		nationalId: {
			type: String,
			required: false,
			default: null,
		},
		firstName: {
			type: String,
			required: false,
			default: null,
		},
		lastName: {
			type: String,
			required: false,
			default: null,
		},
		phoneNumber: {
			type: String,
			required: false,
			default: null,
		},
		userType: {
			type: String,
			enum: ["individual", "legal"],
			required: false,
			default: null,
		},
		requiredLanguages: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],
			required: false,
			default: [],
		},
		specialtyField: {
			type: String,
			required: false,
			default: null,
		},
		referralSource: {
			type: String,
			required: false,
			default: null,
		},
		referralCode: {
			type: String,
			required: false,
			default: null,
		},
		ownReferralCode: {
			type: String,
			required: false,
			unique: true,
			sparse: true,
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

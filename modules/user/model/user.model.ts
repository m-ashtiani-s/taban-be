import mongoose, { Document, Model, PaginateModel } from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";
import { LanguageDocument } from "../../translation/language/model/language.model";

export enum UserType {
	INDIVIDUAL = "individual",
	LEGAL = "legal",
}
export enum CustomerType {
	NORMAL = "NORMAL",
	ENTERPRISE = "ENTERPRISE",
}
export enum UserRole {
	ADMIN = "ADMIN",
	OPERATOR = "OPERATOR",
	USER = "USER",
}

export interface User {
	username: string;
	role: UserRole;
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
	/** امتیاز باشگاه مشتریان — هنگام ساخت کاربر ۰ و با پرداخت هر سفارش افزایش می‌یابد */
	score: number;
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
			enum: Object.values(UserRole),
			required: true,
			default: UserRole.USER,
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
			enum: Object.values(CustomerType),
			required: true,
			default: CustomerType.NORMAL,
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
			enum: Object.values(UserType),
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
		score: {
			type: Number,
			default: 0,
			min: 0,
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
const userModel = mongoose.model<UserDocument, PaginateModel<UserDocument>>("User", userSchema);

export default userModel;

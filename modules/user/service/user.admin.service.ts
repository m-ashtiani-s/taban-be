import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import { AdminUpdateUserDto } from "../dto/user.admin.dto";
import { AdminUserFilters } from "../dto/userFilters.admin.dto";
import { UserDocument } from "../model/user.model";
import UserRepository from "../repository/user.repository";
import UserTransform from "../transform/user.transform";

export default class AdminUserService {
	private userRepository = new UserRepository();
	private userTransform = new UserTransform();

	async getUsers(filters: AdminUserFilters, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.userRepository.findPaginated(filters, pagination.getOptions());
		return {
			field: "getUsers",
			success: true,
			message: "لیست کاربران با موفقیت دریافت شد",
			data: this.userTransform.paginatedUsers(paginated),
		};
	}

	async getUserById(userId: string) {
		const user = await this.userRepository.findByUserId(userId, ["requiredLanguages"]);
		if (!user) throw new NotFoundError("کاربر یافت نشد");
		return {
			field: "getUserById",
			success: true,
			message: "اطلاعات کاربر با موفقیت دریافت شد",
			data: this.userTransform.user(user),
		};
	}

	async updateUser(userId: string, data: AdminUpdateUserDto) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) throw new NotFoundError("کاربر یافت نشد");

		const updateData: Partial<UserDocument> = {};
		(Object.keys(data) as (keyof AdminUpdateUserDto)[]).forEach((key) => {
			const value = data[key];
			if (value !== undefined) (updateData as any)[key] = value;
		});

		const updated = await this.userRepository.updateUserById(userId, updateData);
		if (!updated) throw new BadRequestError("ویرایش کاربر با خطا مواجه شد");

		return {
			field: "updateUser",
			success: true,
			message: "کاربر با موفقیت ویرایش شد",
			data: this.userTransform.user(updated),
		};
	}

	async changeUserPassword(userId: string, password: string) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) throw new NotFoundError("کاربر یافت نشد");

		// از updateUser (که .save() صدا می‌زند) استفاده می‌شود تا هوک pre-save رمز را هش کند؛
		// findByIdAndUpdate این هوک را اجرا نمی‌کند و رمز خام ذخیره می‌شد.
		await this.userRepository.updateUser(user, { password });

		return {
			field: "changeUserPassword",
			success: true,
			message: "رمز عبور کاربر با موفقیت تغییر کرد",
			data: null,
		};
	}

	async activateUser(userId: string) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) throw new NotFoundError("کاربر یافت نشد");
		if (user.isActive) throw new BadRequestError("کاربر از قبل فعال است");
		await this.userRepository.setActiveStatus(userId, true);
		return {
			field: "activateUser",
			success: true,
			message: "کاربر با موفقیت فعال شد",
			data: null,
		};
	}

	async deactivateUser(userId: string) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) throw new NotFoundError("کاربر یافت نشد");
		if (!user.isActive) throw new BadRequestError("کاربر از قبل غیرفعال است");
		await this.userRepository.setActiveStatus(userId, false);
		return {
			field: "deactivateUser",
			success: true,
			message: "کاربر با موفقیت غیرفعال شد",
			data: null,
		};
	}
}

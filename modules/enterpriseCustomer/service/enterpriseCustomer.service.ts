import { BadRequestError } from "../../../shared/base/badRequestError.error";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import UserRepository from "../../user/repository/user.repository";
import UserService from "../../user/service/user.service";
import { CustomerType } from "../../user/model/user.model";
import { CreateEnterpriseCustomerDto } from "../dto/enterpriseCustomer.dto";
import EnterpriseCustomerRepository from "../repository/enterpriseCustomer.repository";
import EnterpriseCustomerTransform from "../transform/enterpriseCustomer.transform";

export default class EnterpriseCustomerService {
	private enterpriseCustomerRepository = new EnterpriseCustomerRepository();
	private userRepository = new UserRepository();
	private userService = new UserService();
	private enterpriseCustomerTransform = new EnterpriseCustomerTransform();

	async register(userId: string, data: CreateEnterpriseCustomerDto) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) throw new BadRequestError("مشکلی در یافتن کاربری شما بوجود آمد");

		const existing = await this.enterpriseCustomerRepository.findByUserId(userId);
		if (existing) throw new BadRequestError("شما قبلاً به‌عنوان مشتری سازمانی ثبت شده‌اید");

		const completion = await this.userService.profileCompletionStatus(userId);
		if (!completion.data?.isCompleted) {
			throw new BadRequestError("برای ثبت درخواست مشتری سازمانی، ابتدا باید پروفایل خود را تکمیل کنید");
		}

		const enterpriseCustomer = await this.enterpriseCustomerRepository.create(userId, {
			institutionName: data.institutionName?.trim(),
			institutionAddress: data.institutionAddress?.trim(),
			registrationId: data.registrationId?.trim() || null,
		});

		await this.userRepository.updateUser(user, { customerType: CustomerType.ENTERPRISE });

		return {
			field: "registerEnterpriseCustomer",
			success: true,
			message: "درخواست مشتری سازمانی شما با موفقیت ثبت شد",
			data: this.enterpriseCustomerTransform.enterpriseCustomer(enterpriseCustomer),
		};
	}

	async getMyEnterpriseProfile(userId: string) {
		const enterpriseCustomer = await this.enterpriseCustomerRepository.findByUserId(userId);
		if (!enterpriseCustomer) throw new NotFoundError("مشتری سازمانی یافت نشد");
		return {
			field: "getMyEnterpriseProfile",
			success: true,
			message: "اطلاعات مشتری سازمانی با موفقیت دریافت شد",
			data: this.enterpriseCustomerTransform.enterpriseCustomer(enterpriseCustomer),
		};
	}
}

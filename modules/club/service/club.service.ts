import mongoose from "mongoose";
import { NotFoundError } from "../../../shared/base/notFoundError.error";
import Pagination from "../../../shared/utils/pagination.util";
import type { OrderDocument } from "../../order/model/order.model";
import UserRepository from "../../user/repository/user.repository";
import TranslationItemRepository from "../../translation/translationItem/repository/translationItem.repository";
import ClubConfigRepository from "../repository/clubConfig.repository";
import ScoreTransactionRepository from "../repository/scoreTransaction.repository";
import ClubTransform from "../transform/club.transform";
import { deriveTier } from "../util/tier.util";

export default class ClubService {
	private userRepository = new UserRepository();
	private clubConfigRepository = new ClubConfigRepository();
	private scoreTransactionRepository = new ScoreTransactionRepository();
	private translationItemRepository = new TranslationItemRepository();
	private clubTransform = new ClubTransform();

	async getConfig() {
		const config = await this.clubConfigRepository.getConfig();
		return {
			field: "getClubConfig",
			success: true,
			message: "تنظیمات باشگاه مشتریان با موفقیت دریافت شد",
			data: this.clubTransform.config(config),
		};
	}

	async getMyStatus(userId: string) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) throw new NotFoundError("کاربر یافت نشد");
		const config = await this.clubConfigRepository.getConfig();
		return {
			field: "getMyClubStatus",
			success: true,
			message: "وضعیت باشگاه با موفقیت دریافت شد",
			data: this.clubTransform.status(user.score ?? 0, config),
		};
	}

	/** درصد تخفیف سطح کاربر را از روی امتیاز و پیکربندی برمی‌گرداند (۰ اگر سطحی نداشته باشد). */
	async getDiscountPercentForScore(score: number): Promise<number> {
		const config = await this.clubConfigRepository.getConfig();
		return deriveTier(score ?? 0, config).discountPercent;
	}

	/** درصد تخفیف سطح کاربر را با شناسه‌ی کاربر برمی‌گرداند (۰ برای کاربر ناموجود/مهمان). */
	async getDiscountPercentForUser(userId: string | null | undefined): Promise<number> {
		if (!userId) return 0;
		const user = await this.userRepository.findByUserId(userId);
		if (!user) return 0;
		return this.getDiscountPercentForScore(user.score ?? 0);
	}

	async getMyHistory(userId: string, page: string, pageSize: string, sortOrders: string) {
		const pagination = new Pagination({ page, pageSize, sortOrders });
		const paginated = await this.scoreTransactionRepository.findPaginatedByUser(userId, pagination.getOptions());
		return {
			field: "getMyClubHistory",
			success: true,
			message: "تاریخچه‌ی امتیازها با موفقیت دریافت شد",
			data: this.clubTransform.paginatedTransactions(paginated),
		};
	}

	/**
	 * امتیاز یک سفارشِ پرداخت‌شده را محاسبه و برای کاربر ثبت می‌کند. به‌ازای هر نسخه‌ی هر سند،
	 * «ضریب امتیاز» نوع مدرک افزوده می‌شود. idempotent — اگر قبلاً ثبت شده باشد دوباره ثبت نمی‌شود.
	 */
	async awardForPaidOrder(order: OrderDocument, session?: mongoose.ClientSession): Promise<void> {
		const orderId = (order._id as any)?.toString?.() ?? String(order._id);

		const existing = await this.scoreTransactionRepository.findOneByOrder(orderId, session);
		if (existing) return;

		let points = 0;
		for (const od of order.orderedDocs ?? []) {
			const item = await this.translationItemRepository.findByTranslationItemId(od.translationItemId);
			const multiplier = item?.scoreMultiplier ?? 1;
			// const copies = (od.payload?.documents ?? []).reduce((sum, d) => sum + (d.copyCount ?? 1), 0);
			points = multiplier;
		}
		if (points <= 0) return;

		const userId = ((order.user as any)?._id ?? order.user)?.toString();
		await this.userRepository.incrementScore(userId, points, session);
		await this.scoreTransactionRepository.create(
			{
				user: userId as any,
				order: orderId as any,
				orderNumber: order.orderNumber,
				points,
				description: `امتیاز سفارش شماره ${order.orderNumber}`,
			},
			session
		);
	}
}

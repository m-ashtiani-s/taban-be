import mongoose from "mongoose";
import type { OrderDocument } from "../../order/model/order.model";
import UserRepository from "../../user/repository/user.repository";
import CouponRepository from "../../coupon/repository/coupon.repository";
import { AppliesTo, CouponSource, DiscountType } from "../../coupon/model/coupon.model";

/** درصد تخفیف پاداش معرف روی مبلغ ترجمه پایه */
const REFERRAL_DISCOUNT_PERCENT = 10;

export default class ReferralService {
	private userRepository = new UserRepository();
	private couponRepository = new CouponRepository();

	/**
	 * پس از اولین پرداختِ یک کاربرِ دارای «کد معرف»، برای معرِّفِ او یک کد تخفیف ۱۰٪ یکبارمصرف
	 * روی ترجمه پایه صادر می‌کند. عملیات idempotent است: با یک پرچم اتمیک روی کاربرِ دعوت‌شده،
	 * پاداش فقط یک‌بار (روی اولین پرداخت) صادر می‌شود.
	 */
	async rewardReferrerForFirstPaidOrder(order: OrderDocument, session?: mongoose.ClientSession): Promise<void> {
		const referredUserId = ((order.user as any)?._id ?? order.user)?.toString();
		if (!referredUserId) return;

		const referredUser = await this.userRepository.findByUserId(referredUserId);
		// کاربر باید کد معرف ثبت‌شده داشته باشد و قبلاً پاداشش صادر نشده باشد
		if (!referredUser || !referredUser.referralCode) return;
		if (referredUser.referralRewardGranted) return;

		// یافتن معرِّف از روی کد معرف؛ اگر کاربری با این کد وجود نداشت، کاری انجام نمی‌دهیم
		const referrer = await this.userRepository.findByOwnReferralCode(referredUser.referralCode);
		if (!referrer) return;

		const referrerId = (referrer._id as any)?.toString();
		// جلوگیری از حالت غیرمنتظره‌ی خودمعرفی
		if (referrerId === referredUserId) return;

		// رزرو اتمیک پرچم؛ اگر همین حالا توسط پرداخت هم‌زمانِ دیگری صادر شده باشد، خارج می‌شویم
		const reserved = await this.userRepository.markReferralRewardGranted(referredUserId, session);
		if (!reserved) return;

		try {
			const code = await this.couponRepository.generateUniqueCode("REF", 6);
			await this.couponRepository.createFromPartial({
				code,
				discountType: DiscountType.PERCENT,
				discountValue: REFERRAL_DISCOUNT_PERCENT,
				maxDiscountAmount: null,
				minPurchaseAmount: null,
				startDate: null,
				endDate: null,
				usageLimit: 1,
				usedCount: 0,
				perUserLimit: 1,
				isActive: true,
				description: `پاداش معرف بابت اولین خرید کاربر دعوت‌شده (سفارش ${order.orderNumber})`,
				appliesTo: AppliesTo.BASE,
				applicableTranslationItems: [],
				source: CouponSource.REFERRAL,
				assignedUser: referrerId,
			}, session);

			// TODO(پیامک): ارسال پیامک به معرِّف برای اطلاع از کد تخفیف هدیه
			// گیرنده: referrer.phoneNumber — متن باید شامل code و درصد تخفیف باشد.
		} catch (error) {
			// صدور پاداش یک اثر جانبیِ best-effort است و نباید پرداخت موفق را خراب کند.
			// در صورت خطا، پرچم را آزاد می‌کنیم تا روی پرداخت بعدی دوباره تلاش شود.
			try {
				await this.userRepository.markReferralRewardReset(referredUserId);
			} catch {}
			console.error("[Referral] صدور کد تخفیف پاداش معرف با خطا مواجه شد:", error);
		}
	}
}

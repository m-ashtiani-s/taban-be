import mongoose from "mongoose";
import { BadRequestError } from "../../../shared/base/badRequestError.error";
import UserRepository from "../../user/repository/user.repository";
import RateCalculatorService from "../../rateCalculator/service/rateCalculator.service";
import CartRepository from "../repository/cart.repository";
import CartTransform from "../transform/cart.transform";
import { AddDocumentToCartDto, CartItemDto } from "../dto/cartItem.dto";
import {
	AppliedCouponDocumentDiscountDto,
	AppliedCouponDto,
	AppliedCouponItemDiscountDto,
} from "../dto/cart.dto";
import { CartDocument } from "../model/cart.model";
import { CouponDocument } from "../../coupon/model/coupon.model";
import CouponRepository from "../../coupon/repository/coupon.repository";

export default class CartService {
	private userRepository = new UserRepository();
	private cartRepository = new CartRepository();
	private rateCalculatorService = new RateCalculatorService();
	private couponRepository = new CouponRepository();

	async addDocumentToCart(userId: string, payload: AddDocumentToCartDto) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) {
			throw new BadRequestError("مشکلی در یافتن کاربری شما بوجود آمد");
		}

		const breakdown = await this.rateCalculatorService.computeBreakdown({
			translationItemId: payload.translationItemId,
			languageId: payload.languageId,
			documents: payload.documents,
		});

		const cart = await this.cartRepository.findOrCreateByUserId(userId);

		// قانون یکپارچگی مشتری: یا همه‌ی آیتم‌های سبد برای یک مشتری هستند یا همه بدون مشتری
		const newCustomerId = payload.customerId ?? null;
		if (cart.items.length > 0) {
			const existingCustomerId = cart.items[0]?.payload?.customerId ?? null;
			if (existingCustomerId !== newCustomerId) {
				throw new BadRequestError(
					"تمام آیتم‌های سبد خرید باید برای یک مشتری (یا همگی بدون مشتری) باشند"
				);
			}
		}

		const newItem: CartItemDto = {
			cartItemId: new mongoose.Types.ObjectId().toString(),
			payload: {
				translationItemId: payload.translationItemId,
				languageId: payload.languageId,
				documents: payload.documents,
				passports: payload.passports ?? [],
				assets: payload.assets ?? [],
				customerId: newCustomerId,
			},
			breakdown,
		};

		cart.items.push(newItem);
		await this.recalculateAndRevalidateCoupon(cart);
		await this.cartRepository.updateCart(cart);

		return {
			field: "addDocumentToCart",
			success: true,
			data: new CartTransform().cart(cart),
			message: "پرونده با موفقیت به سبد خرید افزوده شد",
		};
	}

	async removeDocumentFromCart(userId: string, cartItemId: string) {
		const cart = await this.cartRepository.findByUserId(userId);
		if (!cart) {
			throw new BadRequestError("مشکلی در یافتن سبد خرید شما بوجود آمد");
		}

		const before = cart.items.length;
		cart.items = cart.items.filter((it) => it.cartItemId !== cartItemId);
		if (cart.items.length === before) {
			throw new BadRequestError("آیتم مورد نظر در سبد خرید یافت نشد");
		}

		await this.recalculateAndRevalidateCoupon(cart);
		await this.cartRepository.updateCart(cart);
		return {
			field: "removeDocumentFromCart",
			success: true,
			data: new CartTransform().cart(cart),
			message: "آیتم با موفقیت از سبد خرید حذف شد",
		};
	}

	async updateDocumentInCart(userId: string, cartItemId: string, payload: AddDocumentToCartDto) {
		const cart = await this.cartRepository.findByUserId(userId);
		if (!cart) {
			throw new BadRequestError("مشکلی در یافتن سبد خرید شما بوجود آمد");
		}

		const itemIndex = cart.items.findIndex((it) => it.cartItemId === cartItemId);
		if (itemIndex === -1) {
			throw new BadRequestError("آیتم مورد نظر در سبد خرید یافت نشد");
		}

		const breakdown = await this.rateCalculatorService.computeBreakdown({
			translationItemId: payload.translationItemId,
			languageId: payload.languageId,
			documents: payload.documents,
		});

		cart.items[itemIndex] = {
			cartItemId,
			payload: {
				translationItemId: payload.translationItemId,
				languageId: payload.languageId,
				documents: payload.documents,
				passports: payload.passports ?? [],
				assets: payload.assets ?? [],
				// مشتری آیتم هنگام ویرایش حفظ می‌شود تا یکپارچگی سبد خرید به هم نخورد
				customerId: cart.items[itemIndex]?.payload?.customerId ?? payload.customerId ?? null,
			},
			breakdown,
		};

		await this.recalculateAndRevalidateCoupon(cart);
		await this.cartRepository.updateCart(cart);

		return {
			field: "updateDocumentInCart",
			success: true,
			data: new CartTransform().cart(cart),
			message: "پرونده با موفقیت بروزرسانی شد",
		};
	}

	async getCartByUserId(userId: string) {
		const cart = await this.cartRepository.findOrCreateByUserId(userId);
		return {
			field: "getCartByUserId",
			success: true,
			data: new CartTransform().cart(cart),
			message: "سبد خرید با موفقیت دریافت شد",
		};
	}

	async applyCouponToCart(userId: string, couponCode: string) {
		const code = (couponCode ?? "").trim();
		if (!code) {
			throw new BadRequestError("کد تخفیف وارد نشده است");
		}

		const cart = await this.cartRepository.findByUserId(userId);
		if (!cart || !cart.items || cart.items.length === 0) {
			throw new BadRequestError("سبد خرید شما خالی است");
		}

		const coupon = await this.couponRepository.findByCode(code);
		if (!coupon) {
			throw new BadRequestError("کد تخفیف یافت نشد");
		}

		this.assertCouponUsable(coupon);

		const applied = this.evaluateCouponForCart(cart, coupon);

		cart.appliedCoupon = applied;
		cart.cartSum = this.computeCartSum(cart);
		cart.cartSumWithDiscount = Math.max(cart.cartSum - applied.discountAmount, 0);

		await this.cartRepository.updateCart(cart);

		return {
			field: "applyCouponToCart",
			success: true,
			data: new CartTransform().cart(cart),
			message: "کد تخفیف با موفقیت روی سبد خرید اعمال شد",
		};
	}

	async removeCouponFromCart(userId: string) {
		const cart = await this.cartRepository.findByUserId(userId);
		if (!cart) {
			throw new BadRequestError("مشکلی در یافتن سبد خرید شما بوجود آمد");
		}

		if (!cart.appliedCoupon) {
			return {
				field: "removeCouponFromCart",
				success: true,
				data: new CartTransform().cart(cart),
				message: "کد تخفیفی روی سبد خرید اعمال نشده بود",
			};
		}

		cart.appliedCoupon = null;
		cart.cartSum = this.computeCartSum(cart);
		cart.cartSumWithDiscount = cart.cartSum;

		await this.cartRepository.updateCart(cart);

		return {
			field: "removeCouponFromCart",
			success: true,
			data: new CartTransform().cart(cart),
			message: "کد تخفیف از سبد خرید حذف شد",
		};
	}

	/**
	 * مجموع سبد را بازمحاسبه می‌کند و اگر کوپنی روی سبد اعمال شده، اعتبارش
	 * را برای ترکیب جدید آیتم‌ها دوباره می‌سنجد. در صورت بی‌اعتبار شدن کوپن
	 * (مثلاً حذف آخرین مدرک مجاز)، بی‌سر‌و‌صدا برداشته می‌شود تا مبلغ سبد
	 * با واقعیت آیتم‌های فعلی هم‌خوان بماند.
	 */
	private async recalculateAndRevalidateCoupon(cart: CartDocument) {
		cart.cartSum = this.computeCartSum(cart);

		if (!cart.appliedCoupon || cart.items.length === 0) {
			cart.appliedCoupon = null;
			cart.cartSumWithDiscount = cart.cartSum;
			return;
		}

		const coupon = await this.couponRepository.findByCouponId(cart.appliedCoupon.couponId);
		if (!coupon) {
			cart.appliedCoupon = null;
			cart.cartSumWithDiscount = cart.cartSum;
			return;
		}

		try {
			this.assertCouponUsable(coupon);
			const applied = this.evaluateCouponForCart(cart, coupon);
			cart.appliedCoupon = applied;
			cart.cartSumWithDiscount = Math.max(cart.cartSum - applied.discountAmount, 0);
		} catch {
			cart.appliedCoupon = null;
			cart.cartSumWithDiscount = cart.cartSum;
		}
	}

	private computeCartSum(cart: CartDocument): number {
		return cart.items.reduce((sum, it) => sum + (it?.breakdown?.summary?.totalPrice ?? 0), 0);
	}

	private assertCouponUsable(coupon: CouponDocument) {
		const now = new Date();
		if (!coupon.isActive) {
			throw new BadRequestError("کد تخفیف غیرفعال است");
		}
		if (coupon.startDate && coupon.startDate > now) {
			throw new BadRequestError("کد تخفیف هنوز فعال نشده است");
		}
		if (coupon.endDate && coupon.endDate < now) {
			throw new BadRequestError("کد تخفیف منقضی شده است");
		}
		if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
			throw new BadRequestError("ظرفیت استفاده از این کد تخفیف به پایان رسیده است");
		}
	}

	private evaluateCouponForCart(cart: CartDocument, coupon: CouponDocument): AppliedCouponDto {
		const restrictedItems = (coupon.applicableTranslationItems ?? []) as any[];
		const isRestricted = restrictedItems.length > 0;
		const allowedIds = new Set(restrictedItems.map((id) => String(id?._id ?? id)));

		// مرحله ۱: سهم هر مدرک از مبلغ قابل تخفیف را بر اساس قانون appliesTo کوپن
		// محاسبه می‌کنیم. این مقادیر هم برای محاسبه‌ی مبلغ کل تخفیف و هم برای تقسیم
		// پروپرشنال تخفیف بین مدارک استفاده می‌شوند.
		type Contribution = {
			cartItemId: string;
			translationItemId: string;
			documentKey: string;
			contribution: number;
		};
		const contributions: Contribution[] = [];
		const applicableItemIds = new Set<string>();

		for (const item of cart.items) {
			if (isRestricted && !allowedIds.has(String(item.payload.translationItemId))) {
				continue;
			}
			applicableItemIds.add(item.cartItemId);
			for (const doc of item.breakdown?.documents ?? []) {
				const contribution =
					coupon.appliesTo === "base"
						? (doc.base?.total ?? 0) + (doc.specialsTotal ?? 0)
						: doc.documentTotal ?? 0;
				if (contribution <= 0) continue;
				contributions.push({
					cartItemId: item.cartItemId,
					translationItemId: item.payload.translationItemId,
					documentKey: doc.documentKey,
					contribution,
				});
			}
		}

		if (isRestricted && applicableItemIds.size === 0) {
			throw new BadRequestError("این کد تخفیف برای هیچ‌یک از مدارک سبد خرید شما قابل استفاده نیست");
		}

		const applicableSubtotal = contributions.reduce((s, c) => s + c.contribution, 0);

		if (applicableSubtotal <= 0) {
			throw new BadRequestError("مبلغ قابل تخفیف برای این کد در سبد خرید شما صفر است");
		}

		if (coupon.minPurchaseAmount && applicableSubtotal < coupon.minPurchaseAmount) {
			throw new BadRequestError(
				`برای استفاده از این کد تخفیف، حداقل مبلغ قابل تخفیف باید ${coupon.minPurchaseAmount.toLocaleString("fa-IR")} تومان باشد`
			);
		}

		const discountAmount = this.computeDiscount(coupon, applicableSubtotal);

		// مرحله ۲: تخفیف کل را به نسبت سهم هر مدرک تقسیم می‌کنیم. باقی‌مانده‌ی
		// گردکردن به آخرین مدرکِ سهم‌دار اضافه می‌شود تا مجموع همیشه برابر
		// discountAmount باقی بماند.
		const docDiscounts = contributions.map((c) => ({
			cartItemId: c.cartItemId,
			translationItemId: c.translationItemId,
			documentKey: c.documentKey,
			discountAmount: applicableSubtotal > 0 ? Math.floor((c.contribution * discountAmount) / applicableSubtotal) : 0,
		}));
		const allocated = docDiscounts.reduce((s, d) => s + d.discountAmount, 0);
		const remainder = discountAmount - allocated;
		if (remainder !== 0 && docDiscounts.length > 0) {
			docDiscounts[docDiscounts.length - 1].discountAmount += remainder;
		}

		// مرحله ۳: نتایج را بر اساس آیتم سبد گروه‌بندی می‌کنیم.
		const itemMap = new Map<string, AppliedCouponItemDiscountDto>();
		for (const d of docDiscounts) {
			let bucket = itemMap.get(d.cartItemId);
			if (!bucket) {
				bucket = {
					cartItemId: d.cartItemId,
					translationItemId: d.translationItemId,
					itemDiscountTotal: 0,
					documents: [],
				};
				itemMap.set(d.cartItemId, bucket);
			}
			const docEntry: AppliedCouponDocumentDiscountDto = {
				documentKey: d.documentKey,
				discountAmount: d.discountAmount,
			};
			bucket.documents.push(docEntry);
			bucket.itemDiscountTotal += d.discountAmount;
		}

		return {
			couponId: (coupon._id as any)?.toString() ?? "",
			code: coupon.code,
			discountType: coupon.discountType,
			discountValue: coupon.discountValue,
			appliesTo: coupon.appliesTo,
			applicableSubtotal,
			discountAmount,
			itemDiscounts: Array.from(itemMap.values()),
		};
	}

	private computeDiscount(coupon: CouponDocument, applicableSubtotal: number): number {
		if (applicableSubtotal <= 0) return 0;
		if (coupon.discountType === "percent") {
			let discount = (applicableSubtotal * coupon.discountValue) / 100;
			if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
				discount = coupon.maxDiscountAmount;
			}
			return Math.round(discount);
		}
		return Math.min(coupon.discountValue, applicableSubtotal);
	}
}

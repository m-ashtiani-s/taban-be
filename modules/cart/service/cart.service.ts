import { BadRequestError } from "../../../shared/base/badRequestError.error";
import BaseRateRepository from "../../translation/baseRate/repositories/baseRate.repository";
import CertificationRateRepository from "../../translation/certificationRate/repositories/certificationRate.repository";
import DynamicRateRepository from "../../translation/dynamicRate/repositories/dynamicRate.repository";
import JusticeInquiryRateRepository from "../../translation/justiceInquiryRate/repositories/justiceInquiryRate.repository";
import { OrderedDocumentDto } from "../dto/orderedDocumentDto.dto";
import CartRepository from "../repository/cart.repository";
import UserRepository from "../repository/cart.repository";
import CartTransform from "../transform/cart.transform";

export default class CartService {
	private userRepository = new UserRepository();
	private cartRepository = new CartRepository();
	private baseRateRepository = new BaseRateRepository();
	private dynamicRateRepository = new DynamicRateRepository();
	private certificationRateRepository = new CertificationRateRepository();
	private justiceInquiryRateRepository = new JusticeInquiryRateRepository();

	async calculateOrderedDocumentPrice(orderedDocumentDto: OrderedDocumentDto) {
		try {
			const prices: {
				translationItemUuid: string;
				translationItemTitle: string;
				priceDetail: {
					basePrice: number;
					specialPrices: Record<string, number>;
					mfaCertificationPrice: number;
					justiceCertificationPrice: number;
					justiceInquiryPrice: number;
					total: number;
				};
			}[] = [];
			await Promise.all(
				Object.keys(orderedDocumentDto?.translationItemNames)?.map(async (docId) => {
					const translationPrice: {
						basePrice: number;
						specialPrices: Record<string, number>;
						mfaCertificationPrice: number;
						justiceCertificationPrice: number;
						justiceInquiryPrice: number;
						total: number;
					} = {
						basePrice: 0,
						specialPrices: {},
						mfaCertificationPrice: 0,
						justiceCertificationPrice: 0,
						justiceInquiryPrice: 0,
						total: 0,
					};

					// base rate
					const baseRateCount = +orderedDocumentDto.baseRateCount[docId];
					const documentBaseRate = await this.baseRateRepository.findOneBaseRate({
						translationItemId: orderedDocumentDto?.translationItemId,
						languageId: orderedDocumentDto?.languageId,
					});

					if (!documentBaseRate) {
						throw new BadRequestError("مشکلی در یافتن نرخ پایه به وجود آمد");
					}
					const basePrice = documentBaseRate?.basePrice * baseRateCount;
					translationPrice.basePrice = documentBaseRate?.basePrice * baseRateCount;

					//dynamic rates
					let specialPrices: Record<string, number> = {};
					const specialItem = orderedDocumentDto?.specialItems?.find((sp) => sp?.translationItemId === docId);
					if (!specialItem) {
						throw new BadRequestError("مشکلی در یافتن نرخ خاص به وجود آمد");
					}
					await Promise.all(
						specialItem.specials?.map(async (sp) => {
							const dynamicRate = await this.dynamicRateRepository.findByDynamicRateId(sp?.dynamicRateId);
							if (!dynamicRate) {
								throw new BadRequestError("مشکلی در یافتن نرخ خاص به وجود آمد");
							}
							specialPrices[sp?.dynamicRateId] = dynamicRate?.price * sp?.count;
						})
					);
					translationPrice.specialPrices = specialPrices;

					//certification rates

					let mfaCertificationPrice = 0;
					let justiceCertificationPrice = 0;
					const mfaCertification = orderedDocumentDto?.mfaCertification?.find((mfa) => mfa?.translationItemId === docId);
					const justiceCertification = orderedDocumentDto?.justiceCertification?.find(
						(justice) => justice?.translationItemId === docId
					);
					if (mfaCertification && mfaCertification?.mfaCertification) {
						const certificationRate = await this.certificationRateRepository.findByCertificationRateId(
							mfaCertification?.mfaCertification?.certificationRateId
						);
						if (!certificationRate) {
							throw new BadRequestError("مشکلی در یافتن نرخ تایید به وجود آمد");
						}
						mfaCertificationPrice = certificationRate?.mfaPrice;
					}
					if (justiceCertification && justiceCertification?.justiceCertification) {
						const certificationRate = await this.certificationRateRepository.findByCertificationRateId(
							justiceCertification?.justiceCertification?.certificationRateId
						);
						if (!certificationRate) {
							throw new BadRequestError("مشکلی در یافتن نرخ تایید به وجود آمد");
						}
						justiceCertificationPrice = certificationRate?.justicePrice;
					}
					translationPrice.mfaCertificationPrice = mfaCertificationPrice;
					translationPrice.justiceCertificationPrice = justiceCertificationPrice;

					//inquiries rate
					const justiceInquiry = orderedDocumentDto?.justiceInquiriesItems?.find((j) => j?.translationItemId === docId);
					let justiceInquiryPrice = 0;
					if (justiceInquiry) {
						await Promise.all(
							justiceInquiry?.justiceInquiries?.map(async (it) => {
								const justiceInquiryRate = await this.justiceInquiryRateRepository.findByJusticeInquiryRateId(
									it?.justiceInquiryRateId
								);
								if (!justiceInquiryRate) {
									throw new BadRequestError("مشکلی در یافتن نرخ استعلام به وجود آمد");
								}
								justiceInquiryPrice = justiceInquiryPrice + justiceInquiryRate?.price;
							})
						);
					}
					translationPrice.justiceInquiryPrice = justiceInquiryPrice;
					let specialTotal = 0;
					await Promise.all(
						Object.keys(specialPrices)?.map((it) => {
							specialTotal = specialTotal + specialPrices[it];
						})
					);
					translationPrice.total =
						justiceInquiryPrice + basePrice + specialTotal + justiceCertificationPrice + mfaCertificationPrice;

					prices.push({
						translationItemTitle: orderedDocumentDto?.translationItemNames[docId],
						translationItemUuid: docId,
						priceDetail: translationPrice,
					});
				})
			);
			let totalPrice = 0;
			prices?.map((it) => {
				totalPrice = totalPrice + it?.priceDetail?.total;
			});
			return { totalPrice, details: prices };
		} catch (error) {
			return null;
		}
	}
	async addDocumentToCart(userId: string, addDocumentToCartData: OrderedDocumentDto) {
		const user = await this.userRepository.findByUserId(userId);
		if (!user) {
			throw new BadRequestError("مشکلی در یافتن کاربری شما بوجود آمد");
		}
		const cart = await this.cartRepository.findByUserId(userId);
		if (!cart) {
			throw new BadRequestError("مشکلی در یافتن سبد خرید شما بوجود آمد");
		}

		let cartPrice = 0;
		const newCart = [...cart.documents, addDocumentToCartData];
		await Promise.all(
			newCart?.map(async (it) => {
				const price = await this.calculateOrderedDocumentPrice(it);
				if (!price) {
					throw new BadRequestError("مشکلی در محاسبه نرخ بوجود آمد");
				}
				cartPrice = cartPrice + price?.totalPrice;
			})
		);
		cart.documents.push(addDocumentToCartData);
		cart.cartSum = cartPrice;
		//TODO price with discount
		await this.cartRepository.updateCart(cart);
		return {
			field: "profileCompletionStatus",
			success: true,
			data: null,
			message: "پرونده با موفقیت به سبد خرید افزوده شد",
		};
	}
	async calculateDocumentPrice(document: OrderedDocumentDto) {
		const price = await this.calculateOrderedDocumentPrice(document);
		return {
			field: "calculateDocumentPrice",
			success: true,
			data: price,
			message: "محاسبه قیمت با موفقیت انجام شد",
		};
	}

	async getCartByUserId(userId: string) {
		const user = await this.cartRepository.findByUserId(userId);
		if (!user) {
			throw new BadRequestError("مشکلی در یافتن سبد خرید شما بوجود آمد");
		}
		return {
			field: "getCartByUserId",
			success: true,
			data: new CartTransform().cart(user),
			message: "سبد خرید با موفقیت دریافت شد",
		};
	}
}

import fs from "fs";
import path from "path";

/**
 * سازنده‌ی قالب HTML فاکتورِ سفارش. خروجی این فایل توسط رندرر PDF (puppeteer)
 * به یک فایل PDF تبدیل می‌شود. تمام رنگ‌ها و فونت‌ها برای هماهنگی با هویت برند
 * («رسمی‌یاب» — سرمه‌ای #1a3047 و طلایی #b8a27c) و راست‌به‌چپ تنظیم شده‌اند.
 */

// ---------- مدل داده‌ی نمایشی فاکتور ----------

export interface InvoiceParty {
	name: string;
	nationalId?: string | null;
	phone?: string | null;
	extraLines?: string[];
}

export interface InvoiceCompany {
	name: string;
	legalName?: string;
	tagline?: string;
	economicCode?: string;
	nationalId?: string;
	registrationNumber?: string;
	phone?: string;
	email?: string;
	website?: string;
	address?: string;
}

export interface InvoiceLineItem {
	rowNo: number;
	itemLabel: string; // مثل: شناسنامه · انگلیسی
	title: string; // نام مدرک
	details: string[]; // ریز خدمات
	copyCount: number;
	amount: number; // documentTotal
}

export interface InvoiceTotals {
	itemsGross: number; // جمع کل اقلام (پیش از تخفیف‌ها)
	tierDiscount: number; // تخفیف باشگاه مشتریان
	couponCode: string | null;
	couponDiscount: number; // تخفیف کد تخفیف
	vatRate: number; // درصد مالیات (مثلاً ۹)
	vatAmount: number; // مبلغ مالیات
	payable: number; // مبلغ قابل پرداخت نهایی (finalAmount)
}

export interface OrderInvoiceViewModel {
	invoiceTitle: string; // «فاکتور سفارش»
	orderNumber: number;
	issuedAt: string; // تاریخ صدور (شمسی)
	orderDate: string; // تاریخ ثبت سفارش (شمسی)
	isPaid: boolean;
	company: InvoiceCompany;
	buyer: InvoiceParty;
	customer: InvoiceParty | null; // مشتری زیرمجموعه (در سفارش‌های سازمانی)
	shippingAddress: string | null;
	items: InvoiceLineItem[];
	totals: InvoiceTotals;
}

// ---------- فونت (امبد به‌صورت data-uri برای رندر آفلاین) ----------

const FONT_DIR = path.join(__dirname, "../../../assets/fonts");

function loadFontBase64(file: string): string {
	try {
		return fs.readFileSync(path.join(FONT_DIR, file)).toString("base64");
	} catch {
		return "";
	}
}

let fontCss: string | null = null;
function getFontFaceCss(): string {
	if (fontCss !== null) return fontCss;
	const regular = loadFontBase64("Vazirmatn-Regular.woff2");
	const medium = loadFontBase64("Vazirmatn-Medium.woff2");
	const bold = loadFontBase64("Vazirmatn-Bold.woff2");
	const face = (weight: number, b64: string) =>
		b64
			? `@font-face{font-family:'Vazirmatn';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');}`
			: "";
	fontCss = [face(400, regular), face(500, medium), face(700, bold)].join("\n");
	return fontCss;
}

// ---------- هلپرهای قالب‌بندی ----------

const faDigits = (s: string | number) =>
	String(s).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const toCurrency = (n: number) => `${(n ?? 0).toLocaleString("fa-IR")} تومان`;

export function jalaliDateTime(date: Date): string {
	return new Intl.DateTimeFormat("fa-IR", {
		calendar: "persian",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

export function jalaliDate(date: Date): string {
	return new Intl.DateTimeFormat("fa-IR", {
		calendar: "persian",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

function esc(value: unknown): string {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

// نشانِ ساده و رسمیِ برند (مهر/سند) به رنگ طلایی
const LOGO_SVG = `
<svg width="46" height="46" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="44" height="44" rx="12" fill="#ffffff" fill-opacity="0.08" stroke="#b8a27c" stroke-width="1.5"/>
  <path d="M16 14h12l4 4v16a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2Z" stroke="#b8a27c" stroke-width="1.6" fill="none"/>
  <path d="M28 14v4h4" stroke="#b8a27c" stroke-width="1.6" fill="none"/>
  <path d="M18 24h12M18 28h12M18 32h7" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

function partyCard(label: string, party: InvoiceParty): string {
	const rows: string[] = [];
	rows.push(`<div class="party-name">${esc(party.name) || "—"}</div>`);
	if (party.nationalId) rows.push(`<div class="party-row"><span>کد ملی:</span><b>${esc(faDigits(party.nationalId))}</b></div>`);
	if (party.phone) rows.push(`<div class="party-row"><span>شماره تماس:</span><b>${esc(faDigits(party.phone))}</b></div>`);
	for (const line of party.extraLines ?? []) rows.push(`<div class="party-row">${esc(line)}</div>`);
	return `
	<div class="card">
		<div class="card-label">${esc(label)}</div>
		${rows.join("")}
	</div>`;
}

function companyCard(c: InvoiceCompany): string {
	const rows: string[] = [];
	if (c.legalName) rows.push(`<div class="party-row"><b>${esc(c.legalName)}</b></div>`);
	if (c.nationalId) rows.push(`<div class="party-row"><span>شناسه ملی:</span><b>${esc(faDigits(c.nationalId))}</b></div>`);
	if (c.economicCode) rows.push(`<div class="party-row"><span>کد اقتصادی:</span><b>${esc(faDigits(c.economicCode))}</b></div>`);
	if (c.registrationNumber) rows.push(`<div class="party-row"><span>شماره ثبت:</span><b>${esc(faDigits(c.registrationNumber))}</b></div>`);
	if (c.phone) rows.push(`<div class="party-row"><span>تلفن:</span><b>${esc(faDigits(c.phone))}</b></div>`);
	if (c.email) rows.push(`<div class="party-row"><span>ایمیل:</span><b dir="ltr">${esc(c.email)}</b></div>`);
	if (c.address) rows.push(`<div class="party-row">${esc(c.address)}</div>`);
	return `
	<div class="card">
		<div class="card-label">فروشنده</div>
		<div class="party-name">${esc(c.name)}</div>
		${rows.join("")}
	</div>`;
}

function itemRow(item: InvoiceLineItem): string {
	const details = item.details.length
		? `<div class="row-details">${item.details.map((d) => `<span>${esc(d)}</span>`).join("")}</div>`
		: "";
	return `
	<tr>
		<td class="col-no">${esc(faDigits(item.rowNo))}</td>
		<td class="col-desc">
			<div class="row-item-label">${esc(item.itemLabel)}</div>
			<div class="row-title">${esc(item.title)}</div>
			${details}
		</td>
		<td class="col-copy">${esc(faDigits(item.copyCount))}</td>
		<td class="col-amount">${esc(toCurrency(item.amount))}</td>
	</tr>`;
}

function totalsRows(t: InvoiceTotals): string {
	const rows: string[] = [];
	rows.push(`<div class="t-row"><span>جمع کل اقلام</span><b>${esc(toCurrency(t.itemsGross))}</b></div>`);
	if (t.tierDiscount > 0)
		rows.push(`<div class="t-row discount"><span>تخفیف باشگاه مشتریان</span><b>− ${esc(toCurrency(t.tierDiscount))}</b></div>`);
	if (t.vatAmount > 0)
		rows.push(`<div class="t-row"><span>مالیات بر ارزش افزوده (${esc(faDigits(t.vatRate))}٪)</span><b>${esc(toCurrency(t.vatAmount))}</b></div>`);
	if (t.couponDiscount > 0)
		rows.push(
			`<div class="t-row discount"><span>تخفیف${t.couponCode ? ` (${esc(t.couponCode)})` : ""}</span><b>− ${esc(toCurrency(t.couponDiscount))}</b></div>`
		);
	return rows.join("");
}

// ---------- قالب اصلی ----------

export function buildOrderInvoiceHtml(vm: OrderInvoiceViewModel): string {
	const taglineHtml = vm.company.tagline ? `<div class="brand-tagline">${esc(vm.company.tagline)}</div>` : "";
	const websiteHtml = vm.company.website ? `<span dir="ltr">${esc(vm.company.website)}</span>` : "";
	const phoneHtml = vm.company.phone ? `<span>${esc(faDigits(vm.company.phone))}</span>` : "";
	const customerCardHtml = vm.customer ? partyCard("مشتری سفارش", vm.customer) : "";
	const shippingHtml = vm.shippingAddress
		? `<div class="card span-2"><div class="card-label">آدرس تحویل</div><div class="party-row">${esc(vm.shippingAddress)}</div></div>`
		: "";

	return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8" />
<style>
	${getFontFaceCss()}
	@page { size: A4; margin: 0; }
	* { box-sizing: border-box; margin: 0; padding: 0; }
	html, body { font-family: 'Vazirmatn', Tahoma, sans-serif; color: #1f2937; background: #fff; }
	body { font-size: 12px; line-height: 1.9; }
	.page { width: 210mm; min-height: 297mm; padding: 0 0 18mm; position: relative; }

	/* سربرگ */
	.header { background: linear-gradient(135deg, #1a3047 0%, #24435f 100%); color: #fff; padding: 22px 28px; display: flex; align-items: center; justify-content: space-between; }
	.brand { display: flex; align-items: center; gap: 14px; }
	.brand-text { display: flex; flex-direction: column; gap: 2px; }
	.brand-name { font-size: 22px; font-weight: 700; letter-spacing: .3px; }
	.brand-tagline { font-size: 11px; color: #cdd6e0; }
	.header-meta { text-align: left; font-size: 11px; color: #e7d9bf; display: flex; flex-direction: column; gap: 3px; }
	.header-accent { height: 4px; background: linear-gradient(90deg, #b8a27c 0%, #d9c79f 50%, #b8a27c 100%); }

	/* عنوان فاکتور */
	.title-bar { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px 6px; }
	.title-bar h1 { font-size: 18px; font-weight: 700; color: #1a3047; }
	.title-info { display: flex; gap: 22px; font-size: 11.5px; color: #475569; }
	.title-info b { color: #1a3047; }
	.badge-paid { display: inline-flex; align-items: center; gap: 6px; background: #e9f7ef; color: #1a7f4b; border: 1px solid #b7e4c9; border-radius: 999px; padding: 5px 12px; font-size: 11px; font-weight: 700; }
	.badge-paid .dot { width: 7px; height: 7px; border-radius: 50%; background: #1a7f4b; }
	.badge-unpaid { background: #fdecec; color: #c0392b; border-color: #f3c2bd; }
	.badge-unpaid .dot { background: #c0392b; }

	/* کارت‌های طرفین */
	.parties { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px 28px 6px; }
	.card { border: 1px solid #e6e8ec; border-radius: 12px; padding: 12px 14px; background: #fbfbfc; }
	.card.span-2 { grid-column: 1 / -1; }
	.card-label { font-size: 10.5px; color: #b8a27c; font-weight: 700; margin-bottom: 6px; letter-spacing: .3px; }
	.party-name { font-size: 13.5px; font-weight: 700; color: #1a3047; margin-bottom: 4px; }
	.party-row { font-size: 11.5px; color: #475569; display: flex; gap: 6px; }
	.party-row span { color: #94a3b8; }
	.party-row b { color: #334155; font-weight: 500; }

	/* جدول اقلام */
	.items { padding: 14px 28px 0; }
	table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid #e6e8ec; }
	thead th { background: #1a3047; color: #fff; font-size: 11.5px; font-weight: 500; padding: 11px 12px; text-align: right; }
	thead th.col-no, thead th.col-copy { text-align: center; }
	thead th.col-amount { text-align: left; }
	tbody td { padding: 11px 12px; border-top: 1px solid #eef0f3; vertical-align: top; }
	tbody tr:nth-child(even) { background: #fafbfc; }
	.col-no { text-align: center; color: #94a3b8; width: 6%; }
	.col-copy { text-align: center; color: #475569; width: 10%; }
	.col-amount { text-align: left; font-weight: 700; color: #1a3047; white-space: nowrap; width: 22%; }
	.row-item-label { font-size: 12.5px; font-weight: 700; color: #1a3047; }
	.row-title { font-size: 11.5px; color: #64748b; margin-top: 1px; }
	.row-details { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
	.row-details span { font-size: 10.5px; color: #5b6b7c; background: #eef1f5; border: 1px solid #e2e7ee; border-radius: 6px; padding: 2px 7px; }

	/* جمع‌بندی */
	.summary { display: flex; justify-content: flex-start; padding: 16px 28px 0; }
	.summary-box { width: 56%; border: 1px solid #e6e8ec; border-radius: 12px; overflow: hidden; }
	.t-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; font-size: 12px; color: #475569; border-bottom: 1px solid #f1f3f6; }
	.t-row b { color: #1a3047; font-weight: 700; }
	.t-row.discount b { color: #1a7f4b; }
	.t-payable { display: flex; align-items: center; justify-content: space-between; padding: 13px 14px; background: #1a3047; color: #fff; }
	.t-payable span { font-size: 12.5px; }
	.t-payable b { font-size: 16px; font-weight: 700; color: #e7d9bf; }

	.remarks { padding: 14px 28px 0; }
	.remarks-box { border: 1px dashed #d6c9ae; background: #fdfbf6; border-radius: 10px; padding: 10px 14px; font-size: 11px; color: #6b6250; }
	.remarks-box .lbl { color: #b8a27c; font-weight: 700; }

	/* پاورقی */
	.footer { position: absolute; bottom: 0; left: 0; right: 0; }
	.footer-rule { height: 3px; background: linear-gradient(90deg, #b8a27c 0%, #d9c79f 50%, #b8a27c 100%); }
	.footer-content { display: flex; align-items: center; justify-content: space-between; padding: 10px 28px 14px; font-size: 10.5px; color: #8a94a3; }
	.footer-thanks { color: #1a3047; font-weight: 700; font-size: 11px; }
	.footer-contact { display: flex; gap: 14px; }
</style>
</head>
<body>
	<div class="page">
		<div class="header">
			<div class="brand">
				${LOGO_SVG}
				<div class="brand-text">
					<div class="brand-name">${esc(vm.company.name)}</div>
					${taglineHtml}
				</div>
			</div>
			<div class="header-meta">
				${websiteHtml}
				${phoneHtml}
			</div>
		</div>
		<div class="header-accent"></div>

		<div class="title-bar">
			<h1>${esc(vm.invoiceTitle)}</h1>
			<div class="badge-paid ${vm.isPaid ? "" : "badge-unpaid"}">
				<span class="dot"></span>${vm.isPaid ? "پرداخت شده" : "در انتظار پرداخت"}
			</div>
		</div>
		<div class="title-bar" style="padding-top:0;">
			<div class="title-info">
				<div>شماره سفارش: <b>${esc(faDigits(vm.orderNumber))}</b></div>
				<div>تاریخ سفارش: <b>${esc(vm.orderDate)}</b></div>
				<div>تاریخ صدور: <b>${esc(vm.issuedAt)}</b></div>
			</div>
		</div>

		<div class="parties">
			${companyCard(vm.company)}
			${partyCard("خریدار", vm.buyer)}
			${customerCardHtml}
			${shippingHtml}
		</div>

		<div class="items">
			<table>
				<thead>
					<tr>
						<th class="col-no">ردیف</th>
						<th class="col-desc">شرح خدمات</th>
						<th class="col-copy">نسخه</th>
						<th class="col-amount">مبلغ</th>
					</tr>
				</thead>
				<tbody>
					${vm.items.map(itemRow).join("")}
				</tbody>
			</table>
		</div>

		<div class="summary">
			<div class="summary-box">
				${totalsRows(vm.totals)}
				<div class="t-payable">
					<span>مبلغ قابل پرداخت</span>
					<b>${esc(toCurrency(vm.totals.payable))}</b>
				</div>
			</div>
		</div>

		<div class="footer">
			<div class="footer-rule"></div>
			<div class="footer-content">
				<div class="footer-thanks">از اعتماد شما سپاسگزاریم.</div>
				<div class="footer-contact">
					${websiteHtml}
					${phoneHtml}
				</div>
			</div>
		</div>
	</div>
</body>
</html>`;
}

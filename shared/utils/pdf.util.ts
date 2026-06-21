import fs from "fs";
import type { Browser, PuppeteerNode } from "puppeteer";

// puppeteer v25 فقط ESM است و این پروژه CommonJS (ts-node با require) است،
// پس باید با dynamic import لود شود. از new Function استفاده می‌کنیم تا TypeScript
// این import() را به require() تبدیل نکند (وگرنه با module=commonjs خطای ERR_REQUIRE_ESM می‌گیریم).
const importEsm = new Function("specifier", "return import(specifier)") as (specifier: string) => Promise<any>;

let puppeteerPromise: Promise<PuppeteerNode> | null = null;
function loadPuppeteer(): Promise<PuppeteerNode> {
	if (!puppeteerPromise) {
		puppeteerPromise = importEsm("puppeteer").then((m) => (m.default ?? m) as PuppeteerNode);
	}
	return puppeteerPromise;
}

/**
 * رندر HTML به PDF با کروم headless.
 *
 * نکته‌ی محیط: دانلودِ خودکارِ Chromium توسط puppeteer ممکن است در سرور/شبکه مسدود باشد،
 * بنابراین مسیر اجراییِ مرورگر به این ترتیب حل می‌شود:
 *   ۱) متغیر محیطی PUPPETEER_EXECUTABLE_PATH (توصیه‌شده برای پروداکشن)
 *   ۲) مرورگرِ همراهِ puppeteer (اگر دانلود شده باشد)
 *   ۳) مرورگرِ Chromium-baseِ نصب‌شده‌ی سیستم (Chrome / Edge / Chromium)
 */

let browserPromise: Promise<Browser> | null = null;

const CANDIDATE_EXECUTABLES = [
	// Windows
	"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
	"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
	"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
	"C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
	// Linux
	"/usr/bin/google-chrome",
	"/usr/bin/google-chrome-stable",
	"/usr/bin/chromium",
	"/usr/bin/chromium-browser",
	"/snap/bin/chromium",
	// macOS
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
];

async function resolveExecutablePath(puppeteer: PuppeteerNode): Promise<string | undefined> {
	const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
	if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;

	try {
		const bundled = await puppeteer.executablePath();
		if (typeof bundled === "string" && bundled && fs.existsSync(bundled)) return bundled;
	} catch {
		// مرورگرِ همراه دانلود نشده — به سراغ مرورگرِ سیستم می‌رویم
	}

	for (const candidate of CANDIDATE_EXECUTABLES) {
		if (fs.existsSync(candidate)) return candidate;
	}
	return undefined;
}

/** مرورگر را یک‌بار راه‌اندازی و بین درخواست‌ها بازاستفاده می‌کند. */
async function getBrowser(): Promise<Browser> {
	if (!browserPromise) {
		browserPromise = loadPuppeteer()
			.then(async (puppeteer) => {
				const executablePath = await resolveExecutablePath(puppeteer);
				return puppeteer.launch({
					headless: true,
					executablePath,
					args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
				});
			})
			.catch((err: unknown) => {
				// در صورت خطا اجازه‌ی تلاش مجدد در درخواست بعدی داده می‌شود
				browserPromise = null;
				throw err;
			});
	}
	return browserPromise;
}

export async function renderHtmlToPdf(html: string): Promise<Buffer> {
	const browser = await getBrowser();
	const page = await browser.newPage();
	try {
		await page.setContent(html, { waitUntil: "load" });
		// اطمینان از بارگذاری کاملِ فونت‌های امبدشده پیش از تولید PDF
		await page.evaluateHandle("document.fonts.ready");
		const pdf = await page.pdf({
			format: "A4",
			printBackground: true,
			preferCSSPageSize: true,
			margin: { top: "0", bottom: "0", left: "0", right: "0" },
		});
		return Buffer.from(pdf);
	} finally {
		await page.close();
	}
}

/** بستن مرورگر (مثلاً هنگام خاموش‌شدن سرور). */
export async function closePdfBrowser(): Promise<void> {
	if (!browserPromise) return;
	const browser = await browserPromise.catch(() => null);
	browserPromise = null;
	if (browser) await browser.close();
}

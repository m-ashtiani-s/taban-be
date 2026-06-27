/**
 * کانفیگ puppeteer.
 * Chromium همراه را موقع نصب دانلود نکن — دانلود از storage.googleapis.com
 * در برخی شبکه‌ها/سرورها مسدود است (۴۰۳).
 * در زمان اجرا، shared/utils/pdf.util.ts به‌صورت خودکار سراغ Chrome/Edge نصب‌شده‌ی
 * سیستم می‌رود (یا PUPPETEER_EXECUTABLE_PATH اگر تنظیم شده باشد).
 */
module.exports = {
	skipDownload: true,
};

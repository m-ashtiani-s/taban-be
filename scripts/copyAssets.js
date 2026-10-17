/**
 * کپی پوشه‌ی assets به خروجی بیلد.
 * کدها با path.join(__dirname, "../../../assets/...") فایل‌ها را می‌خوانند؛ بعد از بیلد
 * __dirname داخل build/ است، پس assets باید در build/assets هم وجود داشته باشد.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
fs.cpSync(path.join(root, "assets"), path.join(root, "build", "assets"), { recursive: true });
console.log("✅ assets copied to build/assets");

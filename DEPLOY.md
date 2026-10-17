# CI/CD

## چه چیزی کِی اجرا می‌شود

| Workflow | زمان اجرا | کار |
|---|---|---|
| `ci.yml` | هر PR و هر push به برنچ‌های غیر از `master` | `npm ci` + `npm run build` |
| `release.yml` | push به `master` که `package.json` را تغییر دهد **و** `version` بالا رفته باشد | بیلد ← دیپلوی روی سرور ← تگ `v<version>` + GitHub Release |

اگر `version` تغییر نکرده باشد (مثلاً فقط یک پکیج اضافه شده) یا تگ آن نسخه از قبل وجود داشته باشد، هیچ دیپلویی انجام نمی‌شود.
برای دیپلوی دستیِ دوباره‌ی نسخه‌ی فعلی: Actions ← Release & Deploy ← Run workflow.

### انتشار نسخه‌ی جدید

```bash
npm version patch   # یا minor / major — package.json و package-lock.json را بالا می‌برد
git push origin master
```

> `npm version` به‌طور پیش‌فرض یک تگ محلی هم می‌سازد؛ آن را push نکنید (`git push --tags` نزنید) چون تگ بعد از دیپلوی موفق توسط workflow ساخته می‌شود. اگر نمی‌خواهید تگ محلی ساخته شود: `npm version patch --no-git-tag-version`.

## راه‌اندازی یک‌باره

### ۱. روی سرور

- Node.js 22 و pm2 (`npm i -g pm2`) و `curl` نصب باشد.
- یک کاربر با دسترسی SSH (کلید عمومیِ دیپلوی در `~/.ssh/authorized_keys`) که روی `DEPLOY_PATH` دسترسی نوشتن دارد.
- فایل env تولید را بسازید:
  ```bash
  mkdir -p /var/www/taban-be/shared
  nano /var/www/taban-be/shared/.env
  ```
- برای بالا آمدن خودکار بعد از ری‌استارت سرور: `pm2 startup` (یک بار).
- سرور نیازی به `npm install` یا دسترسی به رجیستری npm ندارد؛ `node_modules` داخل بسته‌ی بیلد شده می‌آید.

ساختار پوشه بعد از دیپلوی:

```
/var/www/taban-be/
  current -> releases/1.2.0
  releases/1.1.0  releases/1.2.0  ...   (۵ نسخه‌ی آخر نگه داشته می‌شود)
  shared/.env
  shared/ecosystem.config.js            (توسط اسکریپت ساخته می‌شود)
```

### ۲. در GitHub (Settings ← Secrets and variables ← Actions)

**Secrets**

| نام | اجباری | توضیح |
|---|---|---|
| `SSH_HOST` | ✅ | آدرس سرور |
| `SSH_USER` | ✅ | کاربر SSH |
| `SSH_PRIVATE_KEY` | ✅ | کلید خصوصیِ دیپلوی (مثلاً ساخته‌شده با `ssh-keygen -t ed25519`) |
| `SSH_PORT` | | پیش‌فرض `22` |
| `SSH_KNOWN_HOSTS` | | خروجی `ssh-keyscan -p <port> <host>`؛ اگر خالی باشد هنگام اجرا گرفته می‌شود |

**Variables**

| نام | پیش‌فرض |
|---|---|
| `DEPLOY_PATH` | `/var/www/taban-be` |
| `PM2_APP_NAME` | `taban-be` |

جاب دیپلوی از environment با نام `production` استفاده می‌کند؛ می‌توانید secrets را آنجا تعریف کنید و برایش approval یا محدودیت برنچ بگذارید.

## Health check و rollback

بعد از سوییچ به نسخه‌ی جدید، اسکریپت تا ۳۰ ثانیه منتظر می‌ماند که سرور روی `PORT` (از `shared/.env`) پاسخ HTTP بدهد.
اگر بالا نیاید، لاگ pm2 چاپ می‌شود، `current` به نسخه‌ی قبلی برمی‌گردد و workflow شکست می‌خورد (تگ و Release ساخته نمی‌شود).

rollback دستی:

```bash
cd /var/www/taban-be
ln -sfn releases/<نسخه‌ی-قبلی> current
pm2 startOrReload shared/ecosystem.config.js --update-env
```

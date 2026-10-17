#!/usr/bin/env bash
# آماده‌سازی یک‌باره‌ی سرور برای دیپلوی خودکار (release.yml + deploy.sh).
# روی سرور (Ubuntu/Debian) و با کاربر root اجرا شود:
#
#   bash server-setup.sh "<محتوای کلید عمومی دیپلوی، مثلاً ssh-ed25519 AAAA... github-deploy>"
#
# کارهایی که انجام می‌دهد (اجرای دوباره بی‌خطر است):
#   ۱) نصب curl و Node.js 22 (از nodejs.org) و pm2
#   ۲) نصب Chromium برای ساخت PDF فاکتور (اگر نصب نشد فقط هشدار می‌دهد)
#   ۳) ساخت کاربر دیپلوی و قرار دادن کلید عمومی در authorized_keys آن
#   ۴) ساخت پوشه‌ی $DEPLOY_PATH/shared و یک فایل .env نمونه
#   ۵) فعال‌سازی pm2 startup تا بعد از ری‌استارت سرور، برنامه خودش بالا بیاید
#
# متغیرهای اختیاری: DEPLOY_USER (پیش‌فرض deploy)، DEPLOY_PATH (پیش‌فرض /var/www/taban-be)،
# NODE_MIRROR (پیش‌فرض https://nodejs.org/dist)، NPM_REGISTRY (پیش‌فرض https://registry.npmjs.org)
set -euo pipefail

PUBLIC_KEY="${1:-}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/taban-be}"
NODE_MAJOR=22
NODE_MIRROR="${NODE_MIRROR:-https://nodejs.org/dist}"
NPM_REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org}"

step() { echo; echo "==> $*"; }
warn() { echo "⚠️  $*"; }
fail() { echo "❌ $*"; exit 1; }

[ "$(id -u)" -eq 0 ] || fail "این اسکریپت باید با root اجرا شود (sudo bash server-setup.sh ...)"
command -v apt-get >/dev/null || fail "فقط Ubuntu/Debian پشتیبانی می‌شود"
case "$PUBLIC_KEY" in
	ssh-ed25519\ *|ssh-rsa\ *|ecdsa-sha2-*) ;;
	*) fail "کلید عمومی را به‌عنوان آرگومان بدهید؛ باید با ssh-ed25519 شروع شود (محتوای فایل .pub)" ;;
esac

# بدون فضای خالی، نصب‌ها و ساخت کاربر نیمه‌کاره می‌مانند؛ قبل از هر تغییری چک می‌شود.
free_mb="$(df -Pm / | awk 'NR==2 {print $4}')"
[ "$free_mb" -ge 1024 ] || fail "فضای خالی دیسک فقط ${free_mb}MB است؛ حداقل 1GB خالی کنید و دوباره اجرا کنید"

export DEBIAN_FRONTEND=noninteractive

step "نصب ابزارهای پایه"
apt-get update -y
apt-get install -y curl ca-certificates xz-utils tar

step "نصب Node.js $NODE_MAJOR"
current_major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
if [ "$current_major" -ge "$NODE_MAJOR" ]; then
	echo "Node.js $(node -v) از قبل نصب است"
else
	case "$(uname -m)" in
		x86_64) arch=x64 ;;
		aarch64) arch=arm64 ;;
		*) fail "معماری $(uname -m) پشتیبانی نمی‌شود" ;;
	esac
	tarball="$(curl -fsSL "$NODE_MIRROR/latest-v$NODE_MAJOR.x/SHASUMS256.txt" | grep -o "node-v[0-9.]*-linux-$arch.tar.xz" | head -n1 || true)"
	[ -n "$tarball" ] || fail "دانلود Node.js از $NODE_MIRROR ممکن نشد؛ با NODE_MIRROR یک میرور دیگر بدهید"
	curl -fsSL "$NODE_MIRROR/latest-v$NODE_MAJOR.x/$tarball" | tar -xJ -C /usr/local --strip-components=1
	echo "Node.js $(node -v) نصب شد"
fi

step "نصب pm2"
if command -v pm2 >/dev/null; then
	echo "pm2 از قبل نصب است"
else
	npm install -g pm2 --registry "$NPM_REGISTRY"
fi

step "نصب Chromium (برای PDF فاکتور)"
# روی Ubuntu، /usr/bin/chromium-browser فقط پوسته‌ی snap است؛ برای همین خود فایل اجرایی چک می‌شود.
has_browser() {
	for b in /usr/bin/chromium /usr/bin/google-chrome /usr/bin/google-chrome-stable /snap/bin/chromium; do
		[ -x "$b" ] && return 0
	done
	return 1
}
if ! has_browser; then
	apt-get install -y chromium || apt-get install -y chromium-browser || true
	has_browser || { command -v snap >/dev/null && snap install chromium; } || true
fi
if has_browser; then
	echo "مرورگر Chromium آماده است"
else
	warn "Chromium نصب نشد؛ برنامه بالا می‌آید ولی ساخت PDF فاکتور کار نمی‌کند"
fi

step "ساخت کاربر دیپلوی: $DEPLOY_USER"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
	useradd --create-home --shell /bin/bash "$DEPLOY_USER"
fi
DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$DEPLOY_HOME/.ssh"
touch "$DEPLOY_HOME/.ssh/authorized_keys"
grep -qxF "$PUBLIC_KEY" "$DEPLOY_HOME/.ssh/authorized_keys" || echo "$PUBLIC_KEY" >> "$DEPLOY_HOME/.ssh/authorized_keys"
chmod 600 "$DEPLOY_HOME/.ssh/authorized_keys"
chown "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_HOME/.ssh/authorized_keys"

step "ساخت پوشه‌ی $DEPLOY_PATH"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$DEPLOY_PATH" "$DEPLOY_PATH/releases" "$DEPLOY_PATH/shared"
ENV_FILE="$DEPLOY_PATH/shared/.env"
if [ ! -f "$ENV_FILE" ]; then
	cat > "$ENV_FILE" <<'EOF'
MONGODB_URI=mongodb://127.0.0.1:27017/taban
SECRET_KEY=CHANGE_ME
PORT=8000
CORS_ORIGINS=
KAVENEGAR_API_KEY=
KAVENEGAR_TEMPLATE=
ZARINPAL_MERCHANT_ID=
ZARINPAL_SANDBOX=false
ZARINPAL_CURRENCY=IRT
PAYMENT_CALLBACK_BASE=
PAYMENT_FRONTEND_RESULT=
EOF
	# یک SECRET_KEY تصادفی به‌جای CHANGE_ME
	sed -i "s|^SECRET_KEY=CHANGE_ME$|SECRET_KEY=$(head -c 48 /dev/urandom | base64 | tr -d '/+=\n')|" "$ENV_FILE"
	echo "فایل نمونه‌ی $ENV_FILE ساخته شد — مقادیرش را کامل کنید"
fi
chown "$DEPLOY_USER:$DEPLOY_USER" "$ENV_FILE"
chmod 600 "$ENV_FILE"

step "فعال‌سازی pm2 startup"
env PATH="$PATH:/usr/local/bin" pm2 startup systemd -u "$DEPLOY_USER" --hp "$DEPLOY_HOME" >/dev/null
echo "pm2 بعد از ری‌استارت سرور خودکار اجرا می‌شود"

if command -v ufw >/dev/null && [[ "$(ufw status 2>/dev/null)" == *"Status: active"* ]]; then
	step "فایروال (ufw)"
	ufw allow OpenSSH >/dev/null
	echo "SSH در ufw باز است"
fi

if ! command -v mongod >/dev/null && ! command -v mongosh >/dev/null; then
	warn "MongoDB روی این سرور پیدا نشد؛ اگر دیتابیس روی همین سرور است باید جداگانه نصبش کنید"
fi

echo
echo "🎉 سرور آماده است."
echo "   کاربر SSH برای GitHub (SSH_USER): $DEPLOY_USER"
echo "   قدم بعد: nano $ENV_FILE  ← مقادیر واقعی را وارد کنید"

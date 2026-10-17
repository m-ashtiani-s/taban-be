#!/usr/bin/env bash
# اسکریپت دیپلوی روی سرور — توسط GitHub Actions (release.yml) اجرا می‌شود.
#
# ساختار پوشه روی سرور:
#   $DEPLOY_PATH/
#     releases/<version>/   ← هر نسخه یک پوشه (build + node_modules + package.json)
#     shared/.env           ← فایل env تولید؛ یک بار دستی ساخته می‌شود و در هر نسخه لینک می‌شود
#     current -> releases/<version>
#
# استفاده: deploy.sh <version> <tarball> <deploy_path> <pm2_app_name>
set -euo pipefail

VERSION="$1"
TARBALL="$2"
DEPLOY_PATH="$3"
APP_NAME="$4"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

RELEASES_DIR="$DEPLOY_PATH/releases"
SHARED_DIR="$DEPLOY_PATH/shared"
RELEASE_DIR="$RELEASES_DIR/$VERSION"
CURRENT_LINK="$DEPLOY_PATH/current"

command -v node >/dev/null || { echo "❌ node روی سرور نصب نیست"; exit 1; }
command -v pm2 >/dev/null || { echo "❌ pm2 روی سرور نصب نیست (npm i -g pm2)"; exit 1; }

if [ ! -f "$SHARED_DIR/.env" ]; then
	echo "❌ فایل $SHARED_DIR/.env وجود ندارد. یک بار دستی بسازیدش و دوباره اجرا کنید."
	exit 1
fi

mkdir -p "$RELEASES_DIR"
PREVIOUS_RELEASE="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"

echo "📦 Extracting $VERSION ..."
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"
tar -xzf "$TARBALL" -C "$RELEASE_DIR"
rm -f "$TARBALL"
ln -sfn "$SHARED_DIR/.env" "$RELEASE_DIR/.env"

# فایل ecosystem برای pm2؛ مسیرها به current اشاره می‌کنند تا در هر reload نسخه‌ی جدید خوانده شود.
cat > "$SHARED_DIR/ecosystem.config.js" <<EOF
module.exports = {
	apps: [
		{
			name: "$APP_NAME",
			script: "$CURRENT_LINK/build/index.js",
			cwd: "$CURRENT_LINK",
			env: { NODE_ENV: "production" },
		},
	],
};
EOF

switch_to() {
	ln -sfn "$1" "$CURRENT_LINK.tmp"
	mv -Tf "$CURRENT_LINK.tmp" "$CURRENT_LINK"
	pm2 startOrReload "$SHARED_DIR/ecosystem.config.js" --update-env
}

health_check() {
	local port
	port="$(grep -E '^PORT=' "$SHARED_DIR/.env" | tail -n1 | cut -d= -f2- | tr -d "\"' \r")"
	port="${port:-8000}"
	for _ in $(seq 1 15); do
		sleep 2
		# هر پاسخ HTTP (حتی ۴۰۴) یعنی سرور بالا آمده است.
		code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$port/api" || true)"
		if [ "$code" != "000" ]; then
			echo "✅ Server is up on port $port (HTTP $code)"
			return 0
		fi
	done
	return 1
}

echo "🚀 Switching to $VERSION ..."
switch_to "$RELEASE_DIR"

if ! health_check; then
	echo "❌ Health check failed for $VERSION"
	pm2 logs "$APP_NAME" --lines 50 --nostream || true
	if [ -n "$PREVIOUS_RELEASE" ] && [ -d "$PREVIOUS_RELEASE" ] && [ "$PREVIOUS_RELEASE" != "$RELEASE_DIR" ]; then
		echo "↩️  Rolling back to $(basename "$PREVIOUS_RELEASE") ..."
		switch_to "$PREVIOUS_RELEASE"
	fi
	exit 1
fi

pm2 save >/dev/null

# فقط چند نسخه‌ی آخر نگه داشته می‌شود (برای rollback دستی).
ls -1dt "$RELEASES_DIR"/*/ | tail -n +"$((KEEP_RELEASES + 1))" | while read -r old; do
	[ "$(readlink -f "$old")" = "$(readlink -f "$CURRENT_LINK")" ] && continue
	echo "🧹 Removing old release $(basename "$old")"
	rm -rf "$old"
done

echo "🎉 Deployed $VERSION"

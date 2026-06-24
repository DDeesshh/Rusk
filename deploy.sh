#!/bin/bash
# Деплой на Beget после git pull. Запуск: bash deploy.sh
set -e

ROOT="/var/www/rusk"
WEB="/var/www/html"

cd "$ROOT"
echo "→ git pull..."
git config --global --add safe.directory "$ROOT" 2>/dev/null || true
git pull

echo "→ права (после clone/pull от root)..."
chown -R nodejs:nodejs "$ROOT"

echo "→ frontend: install + build..."
cd "$ROOT/frontend"
sudo -u nodejs npm install
sudo -u nodejs npm run build

echo "→ копирование dist в /var/www/html (живой сайт)..."
rm -rf "$WEB/assets"
cp -r "$ROOT/frontend/dist/"* "$WEB/"

echo "→ backend в /var/www/html/backend..."
ENV_BACKUP=""
if [ -f "$WEB/backend/.env" ]; then
  ENV_BACKUP=$(mktemp)
  cp "$WEB/backend/.env" "$ENV_BACKUP"
fi
cp -r "$ROOT/backend/"* "$WEB/backend/"
if [ -n "$ENV_BACKUP" ] && [ -f "$ENV_BACKUP" ]; then
  cp "$ENV_BACKUP" "$WEB/backend/.env"
  rm -f "$ENV_BACKUP"
fi

echo "→ backend: npm install..."
cd "$WEB/backend"
sudo -u nodejs npm install

echo "→ права и перезапуск..."
chown -R nodejs:nodejs "$ROOT" "$WEB"
sudo -u nodejs pm2 restart rusk

echo "Готово. Обновите сайт в браузере (Ctrl+F5)."

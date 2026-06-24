#!/bin/bash
# Деплой на Beget после git pull. Запуск: bash deploy.sh
set -e

ROOT="/var/www/rusk"
WEB="/var/www/html"

cd "$ROOT"
echo "→ git pull..."
git pull

echo "→ frontend: install + build..."
cd "$ROOT/frontend"
sudo -u nodejs npm install
sudo -u nodejs npm run build

echo "→ копирование dist и backend в /var/www/html..."
cp -r "$ROOT/frontend/dist/"* "$WEB/"
cp -r "$ROOT/backend/"* "$WEB/backend/"
cp "$ROOT/backend/.env" "$WEB/backend/.env"

echo "→ backend: npm install..."
cd "$WEB/backend"
sudo -u nodejs npm install

echo "→ права и перезапуск..."
chown -R nodejs:nodejs "$ROOT" "$WEB"
sudo -u nodejs pm2 restart rusk

echo "Готово. Обновите сайт в браузере (Ctrl+F5)."

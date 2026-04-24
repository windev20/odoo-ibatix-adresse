#!/bin/bash
set -e
SERVER="root@82.165.222.171"
SSH_KEY="$HOME/.ssh/ibatix_prod"
ADDON_PATH="/opt/odoo19/addons/ibatix_adresse"
GITHUB_TOKEN=$(grep GITHUB_TOKEN /Users/josephabitbol/Documents/ibatix/server.conf | cut -d'"' -f2)
GITHUB_REPO="https://windev20:${GITHUB_TOKEN}@github.com/windev20/odoo-ibatix-adresse.git"

echo "=== 1/3  Push vers GitHub ==="
GITHUB_TOKEN=$(grep GITHUB_TOKEN /Users/josephabitbol/Documents/ibatix/server.conf | cut -d'"' -f2)
git remote set-url origin "https://windev20:${GITHUB_TOKEN}@github.com/windev20/odoo-ibatix-adresse.git"
git push -u origin main

echo "=== 2/3  Pull sur le serveur ==="
ssh -i "$SSH_KEY" "$SERVER" "
  if [ -d '$ADDON_PATH' ]; then
    cd '$ADDON_PATH' && git pull origin main
  else
    git clone '$GITHUB_REPO' '$ADDON_PATH'
  fi
"

echo "=== 3/3  Upgrade Odoo ==="
ssh -i "$SSH_KEY" "$SERVER" "
  docker exec odoo19_app python3 /opt/odoo/odoo/odoo-bin \
    -c /opt/odoo/config/odoo.conf -d ibatix -i ibatix_adresse \
    --stop-after-init --no-http
  docker restart odoo19_app
"
echo "=== Déployé ==="

#!/usr/bin/env bash
set -euo pipefail

SRC="$HOME/projects/ecommerce/"
DEST="/mnt/e/business/ecommerce-backup/"

if [ ! -d "/mnt/e" ]; then
  echo "Le disque E: n'est pas monté (/mnt/e introuvable). Montez-le puis relancez ce script."
  exit 1
fi

mkdir -p "$DEST"

rsync -rv --no-perms --no-owner --no-group --no-times --delete --delete-excluded \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'src/generated' \
  "$SRC" "$DEST"

echo "Sauvegarde terminée vers $DEST"

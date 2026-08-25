#!/usr/bin/env bash
set -euo pipefail

SRC="$HOME/projects/ecommerce/"
DEST="/mnt/e/business/ecommerce-backup/"

if [ ! -d "/mnt/e" ]; then
  echo "Le disque E: n'est pas monté (/mnt/e introuvable). Montez-le puis relancez ce script."
  exit 1
fi

mkdir -p "$DEST"

# Pas de --delete : ce dossier est un miroir de sauvegarde à sens unique,
# jamais un espace de dépôt de fichiers. Sans --delete, rien n'y est jamais
# effacé automatiquement, même si on y ajoute des fichiers à la main
# (--delete a un jour supprimé un CSV déposé ici par erreur).
rsync -rv --no-perms --no-owner --no-group --no-times \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'src/generated' \
  "$SRC" "$DEST"

echo "Sauvegarde terminée vers $DEST"

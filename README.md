# Fasshon

Concept store multi-marques : beauté, soins naturels, bien-être et senteurs — une sélection de marques françaises réunies sur un seul site.

Site en ligne : https://fasshon-shop.vercel.app

## Stack

- [Next.js 16](https://nextjs.org) (App Router, rendu dynamique) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma](https://www.prisma.io) + Postgres (Prisma Postgres)
- [Stripe](https://stripe.com) Checkout pour le paiement
- Déployé sur [Vercel](https://vercel.com), CI sur GitHub Actions

## Démarrer en local

```bash
npm install
npm run dev
```

Copiez `.env.example` vers `.env` et renseignez au minimum `DATABASE_URL`. Les autres variables (`STRIPE_SECRET_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) sont nécessaires pour le paiement et l'admin — voir le détail dans `.env.example`.

Ouvrez [http://localhost:3000](http://localhost:3000).

## Base de données

```bash
npx prisma migrate dev   # applique les migrations
npx tsx prisma/seed.ts   # données placeholder de démo
```

## Import de catalogues fournisseurs

Les exports CSV réels des marques partenaires ne sont jamais commités (voir `imports/`, ignoré par git). Pour importer un catalogue :

```bash
# Déposer le CSV dans imports/, puis :
npx tsx scripts/import-woocommerce.ts <brandSlug> <categorySlug> imports/<fichier>.csv
npx tsx scripts/import-physiomins.ts imports/<fichier>.csv   # format spécifique Physiomins
```

## Espace admin

`/admin` (protégé par mot de passe, voir `ADMIN_PASSWORD`) : gestion des commandes et des produits.

## CI

Chaque push/PR sur `main` déclenche lint, vérification des types, validation du schéma Prisma et build (`.github/workflows/ci.yml`). Le déploiement en production se fait automatiquement via l'intégration Vercel ↔ GitHub.

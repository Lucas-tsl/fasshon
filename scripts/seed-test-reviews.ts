// Avis fictifs pour visualiser le rendu de la fonctionnalité — à
// supprimer avant le lancement public (voir aussi les comptes
// "avis-test-*@example.com" qu'il crée). Usage :
// npx tsx --env-file=.env scripts/seed-test-reviews.ts

import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/user-auth";

const REVIEWERS = [
  { email: "avis-test-camille@example.com", name: "Camille" },
  { email: "avis-test-julien@example.com", name: "Julien" },
  { email: "avis-test-sarah@example.com", name: "Sarah M." },
  { email: "avis-test-lea@example.com", name: "Léa" },
  { email: "avis-test-marc@example.com", name: "Marc D." },
];

const REVIEWS: { slug: string; reviewer: number; rating: number; comment: string }[] = [
  {
    slug: "amber-oud",
    reviewer: 0,
    rating: 5,
    comment: "Un parfum envoûtant qui tient toute la journée. Le flacon 30ml est parfait pour le sac.",
  },
  {
    slug: "amber-oud",
    reviewer: 1,
    rating: 4,
    comment: "Très joli sillage boisé, un peu fort au premier vaporisage mais s'atténue vite.",
  },
  {
    slug: "vanille-de-la-reunion",
    reviewer: 2,
    rating: 5,
    comment: "Ma nouvelle signature olfactive ! Douce sans être écœurante, exactement ce que je cherchais.",
  },
  {
    slug: "musc-blanc",
    reviewer: 3,
    rating: 4,
    comment: "Sent très propre et frais, discret mais présent. Livraison rapide en plus.",
  },
  {
    slug: "douceur-d-agrumes",
    reviewer: 4,
    rating: 3,
    comment: "Sympa mais tient assez peu longtemps sur moi, je dois réappliquer dans l'après-midi.",
  },
  {
    slug: "mini-timeless-neutrals-palette",
    reviewer: 0,
    rating: 5,
    comment: "Des teintes ultra polyvalentes, parfait format voyage. Le fard doré est mon préféré.",
  },
  {
    slug: "sunset-sienna-palette",
    reviewer: 2,
    rating: 4,
    comment: "Belles couleurs pigmentées, un peu de retombées à l'application mais rien de grave.",
  },
  {
    slug: "serum-hydratant-24h-30ml",
    reviewer: 1,
    rating: 5,
    comment: "Ma peau est hydratée toute la journée sans effet gras. Je rachète direct.",
  },
  {
    slug: "creme-riche-hydratante",
    reviewer: 3,
    rating: 4,
    comment: "Texture riche et confortable pour l'hiver, parfaite avant le maquillage.",
  },
  {
    slug: "cure-defenses-325",
    reviewer: 4,
    rating: 5,
    comment: "Prise en cure de 3 semaines, moins fatiguée et le goût est plutôt agréable.",
  },
];

async function main() {
  const users = [];
  for (const r of REVIEWERS) {
    const user = await prisma.user.upsert({
      where: { email: r.email },
      update: {},
      create: { email: r.email, name: r.name, passwordHash: hashPassword("test-password-not-real") },
    });
    users.push(user);
  }

  let created = 0;
  for (const review of REVIEWS) {
    const product = await prisma.product.findUnique({ where: { slug: review.slug } });
    if (!product) {
      console.warn("Produit introuvable :", review.slug);
      continue;
    }
    await prisma.review.upsert({
      where: { userId_productId: { userId: users[review.reviewer].id, productId: product.id } },
      update: { rating: review.rating, comment: review.comment },
      create: {
        userId: users[review.reviewer].id,
        productId: product.id,
        rating: review.rating,
        comment: review.comment,
      },
    });
    created++;
  }

  console.log(`${created} avis de test créés sur ${new Set(REVIEWS.map((r) => r.slug)).size} produits.`);
}

main().then(() => process.exit(0));

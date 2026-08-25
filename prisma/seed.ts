import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// NOTE: Données placeholder pour développer le site en attendant les accords
// distributeur officiels avec chaque marque partenaire. Descriptions et
// variations sont originales (non copiées des sites des marques) — à
// remplacer par les vraies fiches produits une fois chaque partenariat
// confirmé.

const brands = [
  {
    slug: "jozz-beauty",
    name: "JOZZ Beauty",
    description: "Maquillage et accessoires beauté, univers audacieux et coloré.",
    websiteUrl: "https://jozzbeauty.com/",
  },
  {
    slug: "pur-eden",
    name: "Pur Eden",
    description: "Cosmétique bio et soins naturels, aromathérapie.",
    websiteUrl: "https://pureden.fr/",
  },
  {
    slug: "physiomins",
    name: "Physiomins",
    description: "Compléments alimentaires et bien-être holistique.",
    websiteUrl: "https://www.physiomins.com/",
  },
  {
    slug: "les-senteurs-gourmandes",
    name: "Les Senteurs Gourmandes",
    description: "Bougies et brumes parfumées artisanales françaises.",
    websiteUrl: "https://lessenteursgourmandes.fr/",
  },
];

const categories = [
  {
    slug: "maquillage",
    name: "Maquillage & Accessoires",
    description: "Teint, lèvres, yeux et accessoires de maquillage.",
  },
  {
    slug: "soins",
    name: "Soins & Cosmétique bio",
    description: "Nettoyants, sérums, crèmes et soins naturels.",
  },
  {
    slug: "bien-etre",
    name: "Bien-être & Compléments",
    description: "Compléments alimentaires et produits de bien-être.",
  },
  {
    slug: "senteurs",
    name: "Senteurs & Bougies",
    description: "Bougies et brumes parfumées d'ambiance.",
  },
];

type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  sku: string;
  stock: number;
  categorySlug: string;
  brandSlug: string;
  variants?: Array<{
    name: string;
    sku: string;
    priceCents: number;
    stock: number;
    position: number;
  }>;
};

const products: SeedProduct[] = [
  {
    slug: "fond-de-teint-eclat-naturel",
    name: "Fond de Teint Éclat Naturel",
    description:
      "Une texture fluide et légère qui unifie le teint sans le masquer, pour un fini seconde peau tenue toute la journée. Formule enrichie en actifs hydratants. (Fiche produit placeholder)",
    priceCents: 1995,
    compareAtCents: null,
    sku: "JOZ-001",
    stock: 45,
    categorySlug: "maquillage",
    brandSlug: "jozz-beauty",
    variants: [
      { name: "Teinte Claire", sku: "JOZ-001-CLA", priceCents: 1995, stock: 15, position: 1 },
      { name: "Teinte Medium", sku: "JOZ-001-MED", priceCents: 1995, stock: 18, position: 2 },
      { name: "Teinte Hâlée", sku: "JOZ-001-HAL", priceCents: 1995, stock: 12, position: 3 },
    ],
  },
  {
    slug: "kit-pinceaux-voyage",
    name: "Kit Pinceaux Voyage",
    description:
      "5 pinceaux essentiels (teint, poudre, blush, yeux, précision) dans une pochette compacte pensée pour vos déplacements. (Fiche produit placeholder)",
    priceCents: 1495,
    compareAtCents: null,
    sku: "JOZ-002",
    stock: 15,
    categorySlug: "maquillage",
    brandSlug: "jozz-beauty",
  },
  {
    slug: "palette-yeux-safari",
    name: "Palette Yeux Safari",
    description:
      "9 teintes terreuses et dorées, du mat au satiné, pour composer des regards du quotidien aux looks plus intenses. (Fiche produit placeholder)",
    priceCents: 2195,
    compareAtCents: 2495,
    sku: "JOZ-003",
    stock: 12,
    categorySlug: "maquillage",
    brandSlug: "jozz-beauty",
  },
  {
    slug: "serum-anti-rides-fondant",
    name: "Sérum Anti-Rides Fondant",
    description:
      "Sérum concentré en actifs naturels anti-âge, texture fondante qui pénètre instantanément pour une peau visiblement repulpée. (Fiche produit placeholder)",
    priceCents: 2990,
    compareAtCents: null,
    sku: "PED-001",
    stock: 26,
    categorySlug: "soins",
    brandSlug: "pur-eden",
    variants: [
      { name: "15 ml", sku: "PED-001-15", priceCents: 2990, stock: 16, position: 1 },
      { name: "30 ml", sku: "PED-001-30", priceCents: 5600, stock: 10, position: 2 },
    ],
  },
  {
    slug: "deodorant-fraicheur-fabuleux",
    name: "Déodorant Fraîcheur Fabuleux",
    description:
      "Formule naturelle sans sels d'aluminium, protection 24h et parfum délicat. Convient aux peaux sensibles. (Fiche produit placeholder)",
    priceCents: 1050,
    compareAtCents: null,
    sku: "PED-002",
    stock: 25,
    categorySlug: "soins",
    brandSlug: "pur-eden",
  },
  {
    slug: "huile-nettoyante-demaquillante",
    name: "Huile Nettoyante Démaquillante",
    description:
      "Démaquille et nourrit en un seul geste, dissout maquillage waterproof et impuretés sans agresser la peau. Tous types de peau. (Fiche produit placeholder)",
    priceCents: 2400,
    compareAtCents: null,
    sku: "PED-003",
    stock: 18,
    categorySlug: "soins",
    brandSlug: "pur-eden",
  },
  {
    slug: "collagene-marin-cure",
    name: "Collagène Marin",
    description:
      "Complément beauté de la peau à base de collagène marin hydrolysé, pour accompagner l'élasticité cutanée au quotidien. (Fiche produit placeholder)",
    priceCents: 3200,
    compareAtCents: null,
    sku: "PHY-001",
    stock: 32,
    categorySlug: "bien-etre",
    brandSlug: "physiomins",
    variants: [
      { name: "Cure 30 jours", sku: "PHY-001-30J", priceCents: 3200, stock: 20, position: 1 },
      { name: "Cure 60 jours", sku: "PHY-001-60J", priceCents: 5800, stock: 12, position: 2 },
    ],
  },
  {
    slug: "barres-proteinees-x12",
    name: "Barres Protéinées x12",
    description:
      "En-cas riche en protéines et faible en sucres, idéal après l'effort ou pour combler un petit creux sainement. (Fiche produit placeholder)",
    priceCents: 1890,
    compareAtCents: null,
    sku: "PHY-002",
    stock: 30,
    categorySlug: "bien-etre",
    brandSlug: "physiomins",
  },
  {
    slug: "cure-drainante-detox",
    name: "Cure Drainante Détox",
    description:
      "Complexe de plantes (pissenlit, artichaut, thé vert) pour accompagner l'élimination et la sensation de légèreté. (Fiche produit placeholder)",
    priceCents: 2450,
    compareAtCents: 2900,
    sku: "PHY-003",
    stock: 15,
    categorySlug: "bien-etre",
    brandSlug: "physiomins",
  },
  {
    slug: "bougie-vanille-ambree",
    name: "Bougie Vanille Ambrée",
    description:
      "Notes gourmandes de vanille et d'ambre sur un fond boisé, pour une ambiance chaleureuse. Cire végétale, mèche en coton. (Fiche produit placeholder)",
    priceCents: 1800,
    compareAtCents: null,
    sku: "LSG-001",
    stock: 40,
    categorySlug: "senteurs",
    brandSlug: "les-senteurs-gourmandes",
    variants: [
      { name: "Petit format — 120 g", sku: "LSG-001-120", priceCents: 1800, stock: 22, position: 1 },
      { name: "Grand format — 220 g", sku: "LSG-001-220", priceCents: 2500, stock: 18, position: 2 },
    ],
  },
  {
    slug: "brume-fleur-oranger",
    name: "Brume Fleur d'Oranger",
    description:
      "Brume légère à la fleur d'oranger, à vaporiser sur le linge ou en ambiance pour un parfum délicat et durable. (Fiche produit placeholder)",
    priceCents: 1800,
    compareAtCents: null,
    sku: "LSG-002",
    stock: 25,
    categorySlug: "senteurs",
    brandSlug: "les-senteurs-gourmandes",
  },
];

async function main() {
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const { categorySlug, brandSlug, variants, ...product } of products) {
    const [category, brand] = await Promise.all([
      prisma.category.findUniqueOrThrow({ where: { slug: categorySlug } }),
      prisma.brand.findUniqueOrThrow({ where: { slug: brandSlug } }),
    ]);

    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...product,
        images: JSON.stringify([]),
        categoryId: category.id,
        brandId: brand.id,
      },
      create: {
        ...product,
        images: JSON.stringify([]),
        categoryId: category.id,
        brandId: brand.id,
      },
    });

    for (const variant of variants ?? []) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: { ...variant, productId: saved.id },
        create: { ...variant, productId: saved.id },
      });
    }
  }

  const variantCount = products.reduce((sum, p) => sum + (p.variants?.length ?? 0), 0);
  console.log(
    `Seed terminé : ${brands.length} marques, ${categories.length} catégories, ${products.length} produits, ${variantCount} variantes.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

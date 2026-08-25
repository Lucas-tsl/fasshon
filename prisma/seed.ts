import { prisma } from "../src/lib/prisma";

// NOTE: Données placeholder pour développer le site en attendant les accords
// distributeur officiels avec chaque marque partenaire. À remplacer par les
// vraies fiches produits (noms, descriptions, photos, prix pro) une fois
// chaque partenariat confirmé.

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

const products = [
  {
    slug: "fond-de-teint-eclat-naturel",
    name: "Fond de Teint Éclat Naturel",
    description: "Une texture légère au fini naturel, longue tenue. (Fiche produit placeholder)",
    priceCents: 1995,
    compareAtCents: null,
    sku: "JOZ-001",
    stock: 20,
    categorySlug: "maquillage",
    brandSlug: "jozz-beauty",
  },
  {
    slug: "kit-pinceaux-voyage",
    name: "Kit Pinceaux Voyage",
    description: "5 pinceaux essentiels format compact, pochette incluse. (Fiche produit placeholder)",
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
    description: "9 teintes terreuses et dorées, fini mat et satiné. (Fiche produit placeholder)",
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
    description: "Sérum concentré aux actifs naturels, texture fondante. (Fiche produit placeholder)",
    priceCents: 5600,
    compareAtCents: null,
    sku: "PED-001",
    stock: 10,
    categorySlug: "soins",
    brandSlug: "pur-eden",
  },
  {
    slug: "deodorant-fraicheur-fabuleux",
    name: "Déodorant Fraîcheur Fabuleux",
    description: "Formule naturelle, protection 24h sans sels d'aluminium. (Fiche produit placeholder)",
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
    description: "Démaquille et nourrit en un geste, tous types de peau. (Fiche produit placeholder)",
    priceCents: 2400,
    compareAtCents: null,
    sku: "PED-003",
    stock: 18,
    categorySlug: "soins",
    brandSlug: "pur-eden",
  },
  {
    slug: "collagene-marin-cure-30j",
    name: "Collagène Marin - Cure 30 jours",
    description: "Complément beauté de la peau, cure d'un mois. (Fiche produit placeholder)",
    priceCents: 3200,
    compareAtCents: null,
    sku: "PHY-001",
    stock: 20,
    categorySlug: "bien-etre",
    brandSlug: "physiomins",
  },
  {
    slug: "barres-proteinees-x12",
    name: "Barres Protéinées x12",
    description: "En-cas riche en protéines, faible en sucres. (Fiche produit placeholder)",
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
    description: "Complexe de plantes pour accompagner l'élimination. (Fiche produit placeholder)",
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
    description: "Notes de vanille et d'ambre, ambiance chaleureuse. (Fiche produit placeholder)",
    priceCents: 2500,
    compareAtCents: null,
    sku: "LSG-001",
    stock: 20,
    categorySlug: "senteurs",
    brandSlug: "les-senteurs-gourmandes",
  },
  {
    slug: "brume-fleur-oranger",
    name: "Brume Fleur d'Oranger",
    description: "Brume légère à la fleur d'oranger, linge et ambiance. (Fiche produit placeholder)",
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

  for (const { categorySlug, brandSlug, ...product } of products) {
    const [category, brand] = await Promise.all([
      prisma.category.findUniqueOrThrow({ where: { slug: categorySlug } }),
      prisma.brand.findUniqueOrThrow({ where: { slug: brandSlug } }),
    ]);

    await prisma.product.upsert({
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
  }

  console.log(
    `Seed terminé : ${brands.length} marques, ${categories.length} catégories, ${products.length} produits.`,
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

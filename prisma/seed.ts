import { prisma } from "../src/lib/prisma";

// NOTE: Données placeholder pour développer le site en attendant l'accord
// distributeur officiel avec la marque partenaire. À remplacer par les
// vraies fiches produits (noms, descriptions, photos, prix pro) une fois
// le partenariat confirmé.

const categories = [
  {
    slug: "bougies",
    name: "Bougies parfumées",
    description: "Bougies artisanales aux senteurs gourmandes.",
  },
  {
    slug: "brumes",
    name: "Brumes parfumées",
    description: "Brumes d'ambiance et de linge, pour parfumer chaque pièce.",
  },
  {
    slug: "coffrets",
    name: "Coffrets & découverte",
    description: "Sets cadeaux pour découvrir plusieurs senteurs.",
  },
];

const products = [
  {
    slug: "bougie-vanille-ambree",
    name: "Bougie Vanille Ambrée",
    description:
      "Une bougie gourmande aux notes de vanille et d'ambre, pour une ambiance chaleureuse. (Fiche produit placeholder)",
    priceCents: 2500,
    compareAtCents: null,
    sku: "BOU-001",
    stock: 20,
    categorySlug: "bougies",
  },
  {
    slug: "bougie-caramel-beurre-sale",
    name: "Bougie Caramel Beurre Salé",
    description:
      "Notes gourmandes de caramel et de sel, un classique réconfortant. (Fiche produit placeholder)",
    priceCents: 2500,
    compareAtCents: 2900,
    sku: "BOU-002",
    stock: 15,
    categorySlug: "bougies",
  },
  {
    slug: "bougie-fleur-de-coton",
    name: "Bougie Fleur de Coton",
    description:
      "Une senteur douce et propre, entre fleurs blanches et musc léger. (Fiche produit placeholder)",
    priceCents: 2200,
    compareAtCents: null,
    sku: "BOU-003",
    stock: 18,
    categorySlug: "bougies",
  },
  {
    slug: "brume-fleur-oranger",
    name: "Brume Fleur d'Oranger",
    description:
      "Brume légère à la fleur d'oranger, à vaporiser sur le linge ou en ambiance. (Fiche produit placeholder)",
    priceCents: 1800,
    compareAtCents: null,
    sku: "BRU-001",
    stock: 25,
    categorySlug: "brumes",
  },
  {
    slug: "brume-monoi-tiare",
    name: "Brume Monoï Tiaré",
    description:
      "Senteur estivale monoï et fleur de tiaré. (Fiche produit placeholder)",
    priceCents: 1800,
    compareAtCents: null,
    sku: "BRU-002",
    stock: 25,
    categorySlug: "brumes",
  },
  {
    slug: "coffret-decouverte-gourmand",
    name: "Coffret Découverte Gourmand",
    description:
      "3 formats découverte pour tester nos senteurs gourmandes best-sellers. (Fiche produit placeholder)",
    priceCents: 3200,
    compareAtCents: 3900,
    sku: "COF-001",
    stock: 10,
    categorySlug: "coffrets",
  },
  {
    slug: "coffret-cocooning",
    name: "Coffret Cocooning",
    description:
      "Une bougie et une brume assorties pour une soirée cocooning. (Fiche produit placeholder)",
    priceCents: 3900,
    compareAtCents: null,
    sku: "COF-002",
    stock: 10,
    categorySlug: "coffrets",
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const { categorySlug, ...product } of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: categorySlug },
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, images: JSON.stringify([]), categoryId: category.id },
      create: { ...product, images: JSON.stringify([]), categoryId: category.id },
    });
  }

  console.log(`Seed terminé : ${categories.length} catégories, ${products.length} produits.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

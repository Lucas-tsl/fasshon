import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import data from "./import-data/lsg-2026-08-25.json";

// Import ponctuel du catalogue réel Les Senteurs Gourmandes (export CSV
// fourni par la marque dans le cadre de l'accord distributeur), en
// remplacement des produits placeholder utilisés jusqu'ici pour cette
// marque. Ne conserve que les produits actuellement vendus (exclut les
// références "FIN DE COLLECTION" et les ruptures de stock définitives).

const PLACEHOLDER_SLUGS = ["bougie-vanille-ambree", "brume-fleur-oranger"];

async function main() {
  const brand = await prisma.brand.findUniqueOrThrow({
    where: { slug: "les-senteurs-gourmandes" },
  });
  const category = await prisma.category.findUniqueOrThrow({
    where: { slug: "senteurs" },
  });

  const placeholders = await prisma.product.findMany({
    where: { slug: { in: PLACEHOLDER_SLUGS } },
    select: { id: true },
  });
  const placeholderIds = placeholders.map((p) => p.id);

  await prisma.productVariant.deleteMany({ where: { productId: { in: placeholderIds } } });
  const deleted = await prisma.product.deleteMany({ where: { id: { in: placeholderIds } } });
  console.log(`Supprimé ${deleted.count} produit(s) placeholder.`);

  for (const item of data as Array<{
    slug: string;
    name: string;
    description: string;
    priceCents: number;
    compareAtCents: number | null;
    sku: string;
    stock: number;
    image: string;
  }>) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        compareAtCents: item.compareAtCents,
        sku: item.sku,
        stock: item.stock,
        images: JSON.stringify([item.image]),
        active: true,
        categoryId: category.id,
        brandId: brand.id,
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        compareAtCents: item.compareAtCents,
        sku: item.sku,
        stock: item.stock,
        images: JSON.stringify([item.image]),
        active: true,
        categoryId: category.id,
        brandId: brand.id,
      },
    });
  }

  console.log(`Importé ${data.length} produit(s) Les Senteurs Gourmandes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

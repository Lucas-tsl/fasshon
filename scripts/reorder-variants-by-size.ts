import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// Réordonne les variantes de chaque produit par contenance croissante
// (ex: 15 ml, 30 ml, 100 ml) — l'ordre d'import ne suivait pas toujours
// une logique de taille. Usage : npx tsx scripts/reorder-variants-by-size.ts

function parseSize(name: string): number {
  const match = name.match(/[\d,.]+/);
  return match ? Number.parseFloat(match[0].replace(",", ".")) : Number.POSITIVE_INFINITY;
}

async function main() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    where: { variants: { some: {} } },
  });

  let updated = 0;
  for (const product of products) {
    const sorted = [...product.variants].sort((a, b) => parseSize(a.name) - parseSize(b.name));
    for (const [i, variant] of sorted.entries()) {
      if (variant.position !== i) {
        await prisma.productVariant.update({ where: { id: variant.id }, data: { position: i } });
      }
    }
    updated++;
  }

  console.log(`Réordonné ${updated} produit(s) avec variantes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

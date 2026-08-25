import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { classifyPurEden } from "../src/lib/classify-pur-eden";

// Ré-applique la classification Pur Eden (4 familles) aux produits déjà
// en base. Usage : npx tsx --env-file=.env scripts/reclassify-pureden.ts

async function main() {
  const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "pur-eden" } });
  const products = await prisma.product.findMany({ where: { brandId: brand.id } });

  let updated = 0;
  for (const product of products) {
    const productType = classifyPurEden(product.name);
    if (productType !== product.productType) {
      await prisma.product.update({ where: { id: product.id }, data: { productType } });
      updated++;
    }
  }

  console.log(`${updated}/${products.length} produit(s) Pur Eden reclassé(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

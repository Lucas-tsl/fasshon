import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { inferProductType } from "../src/lib/product-type";

async function main() {
  const products = await prisma.product.findMany({ where: { productType: null } });
  for (const p of products) {
    await prisma.product.update({
      where: { id: p.id },
      data: { productType: inferProductType(p.name) },
    });
  }
  console.log(`Type rétro-rempli pour ${products.length} produit(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

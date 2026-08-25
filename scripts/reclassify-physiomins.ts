import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { classifyPhysiomins } from "../src/lib/classify-physiomins";

// Ré-applique la classification Physiomins (6 familles) aux produits déjà
// en base, sans re-télécharger d'images ni relire le CSV.
// Usage : npx tsx --env-file=.env scripts/reclassify-physiomins.ts <csvPath>

type Row = { "Product ID": string; Nom: string; Catégorie: string };

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx scripts/reclassify-physiomins.ts <csvPath>");
    process.exit(1);
  }

  const { readFileSync } = await import("node:fs");
  const { parse } = await import("csv-parse/sync");
  const raw = readFileSync(csvPath, "utf-8");
  const rows: Row[] = parse(raw, { columns: true, bom: true, delimiter: ";", relax_column_count: true });
  const categoryByProductId = new Map(rows.map((r) => [r["Product ID"]?.trim(), r.Catégorie ?? ""]));

  const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "physiomins" } });
  const products = await prisma.product.findMany({ where: { brandId: brand.id } });

  let updated = 0;
  for (const product of products) {
    const productId = product.slug.split("-").pop() ?? "";
    const category = categoryByProductId.get(productId) ?? "";
    const productType = classifyPhysiomins(product.name, category);
    if (productType !== product.productType) {
      await prisma.product.update({ where: { id: product.id }, data: { productType } });
      updated++;
    }
  }

  console.log(`${updated}/${products.length} produit(s) Physiomins reclassé(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

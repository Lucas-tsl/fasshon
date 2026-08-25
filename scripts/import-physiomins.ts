import "dotenv/config";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import { prisma } from "../src/lib/prisma";

// Importeur dédié pour l'export Physiomins, format différent de
// WooCommerce (PrestaShop, séparateur point-virgule, pas de description
// ni de slug/SKU explicites). Usage :
//
//   npx tsx scripts/import-physiomins.ts <csvPath>

type Row = {
  "Product ID": string;
  Image: string;
  Nom: string;
  Référence: string;
  Catégorie: string;
  "Montant HT": string;
  "Montant TTC": string;
  Quantité: string;
  État: string;
  Position: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function downloadImage(url: string, destDir: string, baseName: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    const ext = url.split(".").pop()?.split("?")[0]?.toLowerCase() ?? "jpg";
    const safeExt = /^[a-z0-9]{2,5}$/.test(ext) ? ext : "jpg";
    const fileName = `${baseName}.${safeExt}`;
    mkdirSync(destDir, { recursive: true });
    writeFileSync(join(destDir, fileName), Buffer.from(await res.arrayBuffer()));
    return fileName;
  } catch {
    return null;
  }
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx scripts/import-physiomins.ts <csvPath>");
    process.exit(1);
  }

  const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "physiomins" } });
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: "bien-etre" } });

  const raw = readFileSync(csvPath, "utf-8");
  const rows: Row[] = parse(raw, {
    columns: true,
    bom: true,
    delimiter: ";",
    relax_column_count: true,
  });

  const publicDir = join(process.cwd(), "public", "products", "physiomins");
  let imported = 0;

  for (const row of rows) {
    const name = row.Nom?.trim();
    const priceCents = Math.round(Number.parseFloat(row["Montant TTC"].replace(",", ".")) * 100);
    if (!name || !Number.isFinite(priceCents)) {
      console.warn(`Ignoré (champs invalides) : ${JSON.stringify(row)}`);
      continue;
    }

    const productId = row["Product ID"]?.trim();
    const sku = row["Référence"]?.trim() || `PHY-${productId}`;
    const slug = `${slugify(name)}-${productId}`;
    const stock = Number.parseInt(row["Quantité"] || "0", 10) || 0;

    let images: string[] = [];
    if (row.Image) {
      const fileName = await downloadImage(row.Image.trim(), publicDir, slug);
      if (fileName) images = [`/products/physiomins/${fileName}`];
    }

    await prisma.product.upsert({
      where: { slug },
      update: {
        name,
        description: name,
        priceCents,
        compareAtCents: null,
        sku,
        stock,
        images: JSON.stringify(images),
        active: true,
        categoryId: category.id,
        brandId: brand.id,
      },
      create: {
        slug,
        name,
        description: name,
        priceCents,
        compareAtCents: null,
        sku,
        stock,
        images: JSON.stringify(images),
        active: true,
        categoryId: category.id,
        brandId: brand.id,
      },
    });
    imported++;
  }

  console.log(`Importé ${imported} produit(s) pour Physiomins.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

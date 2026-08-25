import "dotenv/config";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import { prisma } from "../src/lib/prisma";

// Importeur générique pour les exports produits WooCommerce (format commun
// à Les Senteurs Gourmandes, JOZZ Beauty et Pur Eden). Usage :
//
//   npx tsx scripts/import-woocommerce.ts <brandSlug> <categorySlug> <csvPath>
//
// Importe TOUS les produits publiés (post_status = "Publié"), y compris
// ceux en rupture de stock ou marqués fin de collection — seuls les
// brouillons/produits privés (jamais mis en ligne) sont exclus. Télécharge
// la première image de chaque produit dans public/products/<brandSlug>/.

type WooRow = Record<string, string>;

function cleanHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePriceCents(value: string): number | null {
  const n = Number.parseFloat(value.trim().replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : null;
}

function firstImageUrl(images: string): string | null {
  const first = images.split("|")[0]?.split(" ! ")[0]?.trim();
  return first || null;
}

async function downloadImage(url: string, destDir: string, baseName: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    const ext = url.split(".").pop()?.split("?")[0]?.toLowerCase() ?? "jpg";
    const safeExt = /^[a-z0-9]{2,5}$/.test(ext) ? ext : "jpg";
    const fileName = `${baseName}.${safeExt}`;
    mkdirSync(destDir, { recursive: true });
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(join(destDir, fileName), buffer);
    return fileName;
  } catch {
    return null;
  }
}

async function main() {
  const [brandSlug, categorySlug, csvPath] = process.argv.slice(2);
  if (!brandSlug || !categorySlug || !csvPath) {
    console.error(
      "Usage: npx tsx scripts/import-woocommerce.ts <brandSlug> <categorySlug> <csvPath>",
    );
    process.exit(1);
  }
  if (!existsSync(csvPath)) {
    console.error(`Fichier introuvable : ${csvPath}`);
    process.exit(1);
  }

  const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: brandSlug } });
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: categorySlug } });

  const raw = readFileSync(csvPath, "utf-8");
  const rows: WooRow[] = parse(raw, { columns: true, bom: true, relax_column_count: true });

  const published = rows.filter((r) => r.post_status === "Publié");
  console.log(`${rows.length} lignes, ${published.length} publiées (le reste = brouillon/privé, exclu).`);

  const publicDir = join(process.cwd(), "public", "products", brandSlug);

  let imported = 0;
  let skipped = 0;

  for (const row of published) {
    const slug = row.post_name?.trim();
    const name = row.post_title?.trim();
    const sku = row.sku?.trim();
    const priceCents = parsePriceCents(row.regular_price ?? "");
    const salePriceCents = row.sale_price?.trim() ? parsePriceCents(row.sale_price) : null;

    if (!slug || !name || !sku || priceCents === null) {
      console.warn(`Ignoré (champs manquants) : ${name || row.ID}`);
      skipped++;
      continue;
    }

    const description =
      cleanHtml(row.post_content) ||
      cleanHtml(row.post_excerpt) ||
      cleanHtml(row["meta:_yoast_wpseo_metadesc"] ?? "");

    const stock = Number.parseInt(row.stock || "0", 10) || 0;

    let images: string[] = [];
    const imageUrl = firstImageUrl(row.images ?? "");
    if (imageUrl) {
      const fileName = await downloadImage(imageUrl, publicDir, slug);
      if (fileName) images = [`/products/${brandSlug}/${fileName}`];
    }

    await prisma.product.upsert({
      where: { slug },
      update: {
        name,
        description: description || name,
        priceCents: salePriceCents ?? priceCents,
        compareAtCents: salePriceCents ? priceCents : null,
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
        description: description || name,
        priceCents: salePriceCents ?? priceCents,
        compareAtCents: salePriceCents ? priceCents : null,
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

  console.log(`Importé ${imported} produit(s) pour ${brand.name}. Ignorés : ${skipped}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

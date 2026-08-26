import "dotenv/config";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import { prisma } from "../src/lib/prisma";

// Complète les fiches Physiomins avec les images secondaires présentes
// dans la galerie de chaque page produit live (le CSV fournisseur n'a
// qu'une colonne Image unique). Marque autorisée — voir contexte du
// projet. Usage : npx tsx --env-file=.env scripts/scrape-physiomins-gallery.ts <csvPath>

const CATEGORY_SLUGS = [
  "10-bien-etre-sante",
  "11-minceur-perte-de-poids",
  "12-nutrition-proteinee",
  "13-vitalite-energie",
  "14-digestion-microbiote",
  "16-draineurs-retention-d-eau",
  "17-brule-graisse",
  "19-snack-",
  "23-soupes-plats-desserts",
  "28-petit-dejeuner-boissons",
  "31-aperitif",
  "33-anti-gaspillage",
  "36-coupe-faim",
  "37-beaute-de-la-peau",
  "38-beaute-des-cheveux-ongles",
  "40-sommeil",
  "41-immunite",
  "43-complements-alimentaires",
  "44-cremes-corps",
  "45-minceur",
  "46-beaute-de-la-peau",
  "47-circulation",
];

type Row = { "Product ID": string; Image: string };

function imageId(url: string): string {
  const path = url.replace(/^https?:\/\/[^/]+\//, "");
  const firstSegment = path.split("/")[0] ?? "";
  return firstSegment.replace(/-(large_default|medium_default|small_default|home_default)$/, "");
}

function extractGalleryUrls(html: string): string[] {
  const start = html.indexOf("js-slick-product");
  if (start === -1) return [];
  const end = html.indexOf('<!-- /.modal-content -->', start);
  const snippet = html.slice(start, end === -1 ? start + 8000 : end);
  const matches = [...snippet.matchAll(/data-src="([^"]+large_default[^"]+)"/g)];
  return [...new Set(matches.map((m) => m[1]))];
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
    console.error("Usage: npx tsx scripts/scrape-physiomins-gallery.ts <csvPath>");
    process.exit(1);
  }

  const raw = readFileSync(csvPath, "utf-8");
  const rows: Row[] = parse(raw, { columns: true, bom: true, delimiter: ";", relax_column_count: true });
  const knownIdByProductId = new Map<string, string>();
  for (const row of rows) {
    const pid = row["Product ID"]?.trim();
    if (pid && row.Image) knownIdByProductId.set(pid, imageId(row.Image.trim()));
  }

  console.log("Construction de la carte des URLs produit à partir des catégories...");
  const idToUrl = new Map<string, string>();
  for (const catSlug of CATEGORY_SLUGS) {
    try {
      const res = await fetch(`https://www.physiomins.com/${catSlug}.html`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const html = await res.text();
      const links = [...html.matchAll(/href="(https:\/\/www\.physiomins\.com\/[a-z0-9-]+\/(\d+)-[a-z0-9-]+\.html)"/g)];
      for (const [, url, id] of links) idToUrl.set(id, url);
    } catch {
      // ignore
    }
  }
  console.log(`${idToUrl.size} URLs produit trouvées sur ${CATEGORY_SLUGS.length} catégories.`);

  const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "physiomins" } });
  const products = await prisma.product.findMany({ where: { brandId: brand.id } });
  const publicDir = join(process.cwd(), "public", "products", "physiomins");

  let updated = 0;
  for (const product of products) {
    const productId = product.slug.split("-").pop() ?? "";
    const url = idToUrl.get(productId);
    if (!url) {
      console.warn(`Pas d'URL trouvée pour : ${product.name} (id ${productId})`);
      continue;
    }

    let html: string;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) {
        console.warn(`Ignoré (${res.status}) : ${product.name}`);
        continue;
      }
      html = await res.text();
    } catch {
      console.warn(`Échec réseau : ${product.name}`);
      continue;
    }

    const galleryUrls = extractGalleryUrls(html);
    const knownId = knownIdByProductId.get(productId);
    const extras = galleryUrls.filter((u) => imageId(u) !== knownId);
    if (extras.length === 0) continue;

    const existingImages: string[] = JSON.parse(product.images);
    const newLocalPaths: string[] = [];
    for (const [i, remoteUrl] of extras.entries()) {
      const fileName = await downloadImage(remoteUrl, publicDir, `${product.slug}-extra-${i + 1}`);
      if (fileName) newLocalPaths.push(`/products/physiomins/${fileName}`);
    }
    if (newLocalPaths.length === 0) continue;

    await prisma.product.update({
      where: { id: product.id },
      data: { images: JSON.stringify([...existingImages, ...newLocalPaths]) },
    });
    updated++;
    console.log(`${product.name} : +${newLocalPaths.length} image(s)`);
  }

  console.log(`Terminé. ${updated}/${products.length} produit(s) enrichi(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

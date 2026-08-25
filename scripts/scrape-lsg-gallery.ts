import "dotenv/config";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/lib/prisma";

// Complète les fiches Les Senteurs Gourmandes avec les images secondaires
// (photos d'ambiance/détail) présentes dans la galerie de chaque page
// produit live, en plus de l'image principale et des images par variante
// déjà importées (voir import-lsg-scraped.ts). Marque autorisée — voir
// contexte du projet.
//
// La dédup image principale/variante vs. "vraies" images secondaires se
// fait par comparaison des URLs distantes normalisées (le nom de fichier
// local ne permet pas de la faire, on renomme au téléchargement) — on
// relit donc le JSON scrapé d'origine pour retrouver ces URLs par produit.
//
// Usage : npx tsx scripts/scrape-lsg-gallery.ts <jsonPath>

const BASE = "https://lessenteursgourmandes.fr";

function normalizeStem(url: string): string {
  const file = url.split("/").pop() ?? url;
  const withoutExt = file.replace(/\.[a-z0-9]+$/i, "");
  return withoutExt.replace(/-(scaled|\d+x\d+)$/i, "");
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

function extractGalleryUrls(html: string): string[] {
  const start = html.indexOf("wp-block-woocommerce-product-gallery");
  if (start === -1) return [];
  const end = html.indexOf("wc-block-product-gallery-thumbnails__scrollable", start);
  const snippet = html.slice(start, end === -1 ? start + 20000 : end + 20000);
  const seen = new Map<string, string>();
  const re = /<img[^>]*?data-image-id="(\d+)"[^>]*?(?:data-src|src)="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(snippet))) {
    if (!seen.has(m[1])) seen.set(m[1], m[2]);
  }
  return [...seen.values()];
}

type Variant = { sku: string; image: string | null };
type Entry = { slug: string; image: string | null; variants: Variant[] | null };

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Usage: npx tsx scripts/scrape-lsg-gallery.ts <jsonPath>");
    process.exit(1);
  }
  const entries: Entry[] = JSON.parse(readFileSync(jsonPath, "utf-8"));
  const knownByslug = new Map<string, Set<string>>();
  for (const entry of entries) {
    const stems = new Set<string>();
    if (entry.image) stems.add(normalizeStem(entry.image));
    for (const v of entry.variants ?? []) {
      if (v.image) stems.add(normalizeStem(v.image));
    }
    knownByslug.set(entry.slug, stems);
  }

  const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "les-senteurs-gourmandes" } });
  const products = await prisma.product.findMany({ where: { brandId: brand.id } });

  const publicDir = join(process.cwd(), "public", "products", "les-senteurs-gourmandes");
  let updated = 0;

  for (const product of products) {
    const url = `${BASE}/produit/${product.slug}/`;
    let html: string;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) {
        console.warn(`Ignoré (${res.status}) : ${product.name} (${url})`);
        continue;
      }
      html = await res.text();
    } catch {
      console.warn(`Échec réseau : ${product.name} (${url})`);
      continue;
    }

    const galleryUrls = extractGalleryUrls(html);
    const existingImages: string[] = JSON.parse(product.images);
    const knownStems = knownByslug.get(product.slug) ?? new Set<string>();

    // On ne garde que les images de galerie qui ne sont pas déjà utilisées
    // comme image principale ou image de variante.
    const extras = galleryUrls.filter((remoteUrl) => !knownStems.has(normalizeStem(remoteUrl)));

    if (extras.length === 0) continue;

    const newLocalPaths: string[] = [];
    for (const [i, remoteUrl] of extras.entries()) {
      const fileName = await downloadImage(remoteUrl, publicDir, `${product.slug}-extra-${i + 1}`);
      if (fileName) newLocalPaths.push(`/products/les-senteurs-gourmandes/${fileName}`);
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

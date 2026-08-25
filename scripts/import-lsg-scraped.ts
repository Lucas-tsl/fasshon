import "dotenv/config";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/lib/prisma";

// Classement dédié LSG : exactement les 4 familles du catalogue.
function classifyLsg(name: string, categories: string[]): string {
  const nameLower = name.toLowerCase();
  const text = `${name} ${categories.join(" ")}`.toLowerCase();
  // "coffret" doit être vérifié sur le NOM uniquement : les catégories
  // promotionnelles LSG combinent parfois plusieurs familles dans un même
  // libellé (ex. "French Days – Parfums & Coffrets"), qui matcherait à
  // tort tous les parfums s'il était pris en compte ici.
  if (/coffret|calendrier|cracker/.test(nameLower)) return "Coffrets & Sets cadeaux";
  if (/brume/.test(text)) return "Brumes & Eaux parfumées";
  if (/gel douche|shampoing|set découverte|set decouverte|huile/.test(text))
    return "Accessoires & Divers";
  // Le reste du catalogue LSG est du parfum, même quand la fiche ne porte
  // pas explicitement le tag "Eaux de Parfum" (cas des références "fin de
  // collection", taguées différemment côté fournisseur).
  return "Parfums";
}

// Importeur pour Les Senteurs Gourmandes à partir de données extraites des
// fiches produits publiques du site (nom, description, catégories, prix,
// stock et SKU réels par variante — voir imports/lsg-scraped-2026-08-25.json,
// généré par un script d'extraction ponctuel). Utilisé car l'export
// WooCommerce original n'était plus disponible ; importe tous les produits
// actuellement en ligne, y compris ceux marqués "FIN DE COLLECTION".
//
// Usage : npx tsx scripts/import-lsg-scraped.ts <jsonPath>

type Variant = { sku: string; priceCents: number; stock: number; label: string; image: string | null };
type Entry = {
  name: string;
  slug: string;
  description: string;
  categories: string[];
  isVariable: boolean;
  parentSku: string | null;
  variants: Variant[] | null;
  image: string | null;
  sku?: string;
  priceCents?: number;
  stock?: number;
};

function formatLabel(label: string): string {
  return label.replace(/(\d)\s*ml$/i, "$1 ml").trim() || label;
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
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Usage: npx tsx scripts/import-lsg-scraped.ts <jsonPath>");
    process.exit(1);
  }

  const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "les-senteurs-gourmandes" } });
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: "senteurs" } });

  const entries: Entry[] = JSON.parse(readFileSync(jsonPath, "utf-8"));
  const publicDir = join(process.cwd(), "public", "products", "les-senteurs-gourmandes");

  let imported = 0;
  for (const entry of entries) {
    // On ne garde que des catégories vraiment "typées" (pas les tags marketing
    // comme "Idées cadeaux de noël", qui ferait sinon classer plein de
    // parfums en Coffrets à cause du mot "cadeaux").
    const productType = classifyLsg(entry.name, entry.categories);

    let images: string[] = [];
    if (entry.image) {
      const fileName = await downloadImage(entry.image, publicDir, entry.slug);
      if (fileName) images = [`/products/les-senteurs-gourmandes/${fileName}`];
    }

    if (entry.isVariable && entry.variants && entry.parentSku) {
      // Contenance croissante (15 ml, 30 ml, 100 ml...) — l'ordre du JSON
      // scrapé ne le garantit pas.
      entry.variants.sort((a, b) => {
        const sizeA = Number.parseFloat(a.label.match(/[\d,.]+/)?.[0]?.replace(",", ".") ?? "");
        const sizeB = Number.parseFloat(b.label.match(/[\d,.]+/)?.[0]?.replace(",", ".") ?? "");
        return (Number.isFinite(sizeA) ? sizeA : Infinity) - (Number.isFinite(sizeB) ? sizeB : Infinity);
      });
      const priceCents = Math.min(...entry.variants.map((v) => v.priceCents));
      const stock = entry.variants.reduce((sum, v) => sum + v.stock, 0);

      const saved = await prisma.product.upsert({
        where: { slug: entry.slug },
        update: {
          name: entry.name,
          description: entry.description || entry.name,
          priceCents,
          compareAtCents: null,
          sku: entry.parentSku,
          stock,
          images: JSON.stringify(images),
          productType,
          active: true,
          categoryId: category.id,
          brandId: brand.id,
        },
        create: {
          slug: entry.slug,
          name: entry.name,
          description: entry.description || entry.name,
          priceCents,
          compareAtCents: null,
          sku: entry.parentSku,
          stock,
          images: JSON.stringify(images),
          productType,
          active: true,
          categoryId: category.id,
          brandId: brand.id,
        },
      });

      for (const [i, v] of entry.variants.entries()) {
        let variantImage: string | null = null;
        if (v.image) {
          const fileName = await downloadImage(v.image, publicDir, `${entry.slug}-${v.sku}`);
          if (fileName) variantImage = `/products/les-senteurs-gourmandes/${fileName}`;
        }

        await prisma.productVariant.upsert({
          where: { sku: v.sku },
          update: {
            name: formatLabel(v.label),
            priceCents: v.priceCents,
            stock: v.stock,
            position: i,
            image: variantImage,
            productId: saved.id,
          },
          create: {
            name: formatLabel(v.label),
            sku: v.sku,
            priceCents: v.priceCents,
            stock: v.stock,
            position: i,
            image: variantImage,
            productId: saved.id,
          },
        });
      }
    } else if (entry.sku && entry.priceCents != null) {
      await prisma.product.upsert({
        where: { slug: entry.slug },
        update: {
          name: entry.name,
          description: entry.description || entry.name,
          priceCents: entry.priceCents,
          compareAtCents: null,
          sku: entry.sku,
          stock: entry.stock ?? 0,
          images: JSON.stringify(images),
          productType,
          active: true,
          categoryId: category.id,
          brandId: brand.id,
        },
        create: {
          slug: entry.slug,
          name: entry.name,
          description: entry.description || entry.name,
          priceCents: entry.priceCents,
          compareAtCents: null,
          sku: entry.sku,
          stock: entry.stock ?? 0,
          images: JSON.stringify(images),
          productType,
          active: true,
          categoryId: category.id,
          brandId: brand.id,
        },
      });
    } else {
      console.warn(`Ignoré (données insuffisantes) : ${entry.name}`);
      continue;
    }

    imported++;
  }

  console.log(`Importé ${imported}/${entries.length} produit(s) Les Senteurs Gourmandes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

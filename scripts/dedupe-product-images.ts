import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/lib/prisma";

// Détecte et retire les images en double (même contenu, pas juste même
// nom de fichier) dans la galerie de chaque produit — y compris quand
// une image du produit duplique l'image dédiée d'une de ses variantes.
// Usage : npx tsx --env-file=.env scripts/dedupe-product-images.ts

const hashCache = new Map<string, string | null>();

function hashOf(relPath: string): string | null {
  if (hashCache.has(relPath)) return hashCache.get(relPath)!;
  const abs = join(process.cwd(), "public", relPath.replace(/^\//, ""));
  const hash = existsSync(abs) ? createHash("md5").update(readFileSync(abs)).digest("hex") : null;
  hashCache.set(relPath, hash);
  return hash;
}

async function main() {
  const products = await prisma.product.findMany({ include: { variants: true } });

  let fixedProducts = 0;
  let removedTotal = 0;

  for (const product of products) {
    const images: string[] = JSON.parse(product.images);
    const variantHashes = new Set(
      product.variants.map((v) => v.image).filter((x): x is string => !!x).map(hashOf).filter((h): h is string => !!h),
    );

    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const img of images) {
      const hash = hashOf(img);
      if (!hash) {
        deduped.push(img); // fichier manquant, on ne touche pas
        continue;
      }
      if (seen.has(hash) || variantHashes.has(hash)) continue; // doublon
      seen.add(hash);
      deduped.push(img);
    }

    if (deduped.length !== images.length) {
      await prisma.product.update({ where: { id: product.id }, data: { images: JSON.stringify(deduped) } });
      console.log(`${product.name} (${product.slug}) : ${images.length} -> ${deduped.length}`);
      fixedProducts++;
      removedTotal += images.length - deduped.length;
    }
  }

  console.log(`Terminé. ${fixedProducts} produit(s) corrigé(s), ${removedTotal} image(s) en double retirée(s) sur ${products.length} produits vérifiés.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

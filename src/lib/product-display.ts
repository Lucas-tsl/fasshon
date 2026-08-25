import { PRODUCT_TYPE_ORDER } from "./product-type";

type ProductForCard = {
  slug: string;
  name: string;
  priceCents: number;
  compareAtCents: number | null;
  images: string;
  productType: string | null;
  category: { slug: string };
  brand: { name: string };
  variants: { priceCents: number }[];
};

export type CardProduct = ReturnType<typeof toCardProduct>;

export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function toCardProduct(product: ProductForCard) {
  const hasVariants = product.variants.length > 0;
  const priceCents = hasVariants
    ? Math.min(...product.variants.map((v) => v.priceCents))
    : product.priceCents;

  return {
    slug: product.slug,
    name: product.name,
    priceCents,
    compareAtCents: product.compareAtCents,
    categorySlug: product.category.slug,
    brandName: product.brand.name,
    hasVariants,
    images: parseImages(product.images),
    productType: product.productType ?? "Autres",
  };
}

/** Regroupe des produits par type, dans un ordre d'affichage stable et lisible. */
export function groupByType(products: CardProduct[]): Array<{ type: string; products: CardProduct[] }> {
  const groups = new Map<string, CardProduct[]>();
  for (const product of products) {
    const list = groups.get(product.productType) ?? [];
    list.push(product);
    groups.set(product.productType, list);
  }

  const orderedTypes = [
    ...PRODUCT_TYPE_ORDER.filter((t) => groups.has(t)),
    ...Array.from(groups.keys()).filter((t) => !PRODUCT_TYPE_ORDER.includes(t)),
  ];

  return orderedTypes.map((type) => ({ type, products: groups.get(type)! }));
}

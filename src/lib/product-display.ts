import { PRODUCT_TYPE_ORDER } from "./product-type";

const NEW_WINDOW_DAYS = 30;

type ProductForCard = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  compareAtCents: number | null;
  images: string;
  productType: string | null;
  bestSeller: boolean;
  createdAt: Date;
  category: { slug: string };
  brand: { name: string };
  variants: { priceCents: number }[];
  reviews: { rating: number }[];
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
    id: product.id,
    slug: product.slug,
    name: product.name,
    priceCents,
    compareAtCents: product.compareAtCents,
    categorySlug: product.category.slug,
    brandName: product.brand.name,
    hasVariants,
    images: parseImages(product.images),
    productType: product.productType ?? "Autres",
    bestSeller: product.bestSeller,
    isNew: Date.now() - product.createdAt.getTime() < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    reviewCount: product.reviews.length,
    averageRating:
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0,
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

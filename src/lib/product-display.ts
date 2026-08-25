type ProductForCard = {
  slug: string;
  name: string;
  priceCents: number;
  compareAtCents: number | null;
  images: string;
  category: { slug: string };
  brand: { name: string };
  variants: { priceCents: number }[];
};

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
  };
}

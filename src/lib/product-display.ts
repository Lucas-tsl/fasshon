type ProductForCard = {
  slug: string;
  name: string;
  priceCents: number;
  compareAtCents: number | null;
  category: { slug: string };
  brand: { name: string };
  variants: { priceCents: number }[];
};

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
  };
}

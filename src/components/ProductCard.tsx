import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";

export function ProductCard({
  product,
}: {
  product: {
    slug: string;
    name: string;
    priceCents: number;
    compareAtCents: number | null;
    categorySlug: string;
  };
}) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-black/10 p-3 transition hover:border-black/30 dark:border-white/15 dark:hover:border-white/30"
    >
      <ProductImagePlaceholder
        name={product.name}
        categorySlug={product.categorySlug}
        className="aspect-square w-full"
      />
      <div>
        <h3 className="text-sm font-medium">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-semibold">{formatPrice(product.priceCents)}</span>
          {product.compareAtCents ? (
            <span className="text-black/40 line-through dark:text-white/40">
              {formatPrice(product.compareAtCents)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

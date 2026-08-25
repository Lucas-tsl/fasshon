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
    brandName: string;
  };
}) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border p-3 transition hover:border-accent"
    >
      <ProductImagePlaceholder
        name={product.name}
        categorySlug={product.categorySlug}
        className="aspect-square w-full"
      />
      <div>
        <p className="text-xs uppercase tracking-wide text-foreground/50">
          {product.brandName}
        </p>
        <h3 className="text-sm font-medium">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-semibold">{formatPrice(product.priceCents)}</span>
          {product.compareAtCents ? (
            <span className="text-foreground/40 line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

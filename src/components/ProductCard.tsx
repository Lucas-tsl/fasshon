import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({
  product,
  wishlisted = false,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    compareAtCents: number | null;
    categorySlug: string;
    brandName: string;
    hasVariants?: boolean;
    images?: string[];
    bestSeller?: boolean;
    isNew?: boolean;
  };
  wishlisted?: boolean;
}) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col gap-3 rounded-md border border-border p-3 ring-1 ring-transparent transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:ring-foreground"
    >
      <div className="relative">
        <ProductImage
          images={product.images ?? []}
          name={product.name}
          categorySlug={product.categorySlug}
          className="aspect-square w-full transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.bestSeller ? (
            <span className="rounded-sm bg-foreground px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase">
              Best-seller
            </span>
          ) : null}
          {product.isNew ? (
            <span className="rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent-foreground uppercase">
              Nouveau
            </span>
          ) : null}
          {product.compareAtCents && !product.hasVariants ? (
            <span className="rounded-sm bg-foreground/80 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase">
              Promo
            </span>
          ) : null}
        </div>
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} initialWishlisted={wishlisted} compact />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-foreground/50 uppercase">
          {product.brandName}
        </p>
        <h3 className="text-sm font-medium">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-semibold">
            {product.hasVariants ? "Dès " : ""}
            {formatPrice(product.priceCents)}
          </span>
          {!product.hasVariants && product.compareAtCents ? (
            <span className="text-foreground/40 line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

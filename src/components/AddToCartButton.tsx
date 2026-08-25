"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

type Variant = {
  id: string;
  name: string;
  priceCents: number;
  stock: number;
};

export function AddToCartButton({
  product,
  variants,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    stock: number;
    brandName: string;
    categorySlug: string;
  };
  variants: Variant[];
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );

  const hasVariants = variants.length > 0;
  const selectedVariant = hasVariants
    ? (variants.find((v) => v.id === selectedVariantId) ?? variants[0])
    : null;

  const price = selectedVariant ? selectedVariant.priceCents : product.priceCents;
  const outOfStock = selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0;

  return (
    <div className="flex flex-col gap-3">
      {hasVariants ? (
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setSelectedVariantId(variant.id)}
              disabled={variant.stock <= 0}
              className={`rounded-full border px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                selectedVariant?.id === variant.id
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border hover:border-accent"
              }`}
            >
              {variant.name}
              {variant.stock <= 0 ? " (épuisé)" : ""}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <span className="text-xl font-semibold">{formatPrice(price)}</span>
      </div>

      <button
        type="button"
        disabled={outOfStock}
        onClick={() => {
          addItem({
            productId: product.id,
            variantId: selectedVariant?.id ?? null,
            variantName: selectedVariant?.name ?? null,
            slug: product.slug,
            name: product.name,
            priceCents: price,
            brandName: product.brandName,
            categorySlug: product.categorySlug,
          });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="w-fit rounded-full bg-accent px-6 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {outOfStock ? "Rupture de stock" : added ? "Ajouté ✓" : "Ajouter au panier"}
      </button>
    </div>
  );
}

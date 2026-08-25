"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";

type Variant = {
  id: string;
  name: string;
  priceCents: number;
  stock: number;
  image: string | null;
};

export function ProductGallery({
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
    image: string | null;
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
  const displayImage = selectedVariant?.image ?? product.image;

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <ProductImage
        images={displayImage ? [displayImage] : []}
        name={product.name}
        categorySlug={product.categorySlug}
        className="aspect-square w-full md:w-1/2"
        sizes="(min-width: 768px) 50vw, 100vw"
      />

      <div className="flex flex-1 flex-col gap-3">
        {hasVariants ? (
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={variant.stock <= 0}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  selectedVariant?.id === variant.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {variant.name}
                {variant.stock <= 0 ? " (épuisé)" : ""}
              </button>
            ))}
          </div>
        ) : null}

        <span className="font-display text-3xl">{formatPrice(price)}</span>

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
              image: displayImage,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="btn-primary w-fit"
        >
          {outOfStock ? "Rupture de stock" : added ? "Ajouté ✓" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}

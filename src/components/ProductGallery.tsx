"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

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
    images: string[];
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

  const gallery = Array.from(
    new Set([selectedVariant?.image, ...product.images].filter((img): img is string => !!img)),
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(gallery[0] ?? null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resynchronise l'image affichée sur la variante choisie, sans quoi le clic sur une vignette serait écrasé au prochain rendu
    if (selectedVariant?.image) setSelectedImage(selectedVariant.image);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- volontaire : ne réagit qu'au changement de variante, pas aux clics sur les vignettes
  }, [selectedVariantId]);

  const displayImage = selectedImage ?? gallery[0] ?? null;

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="flex w-full flex-col gap-2 md:w-1/2">
        <ProductImage
          images={displayImage ? [displayImage] : []}
          name={product.name}
          categorySlug={product.categorySlug}
          className="aspect-square w-full"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        {gallery.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto">
            {gallery.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted transition ${
                  displayImage === img ? "border-foreground" : "border-border hover:border-foreground/50"
                }`}
                aria-label={`Voir l'image ${i + 1}`}
              >
                <ProductImage images={[img]} name={product.name} categorySlug={product.categorySlug} className="h-full w-full" sizes="64px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

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

        <div className="flex items-center gap-3">
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
          <WishlistButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}

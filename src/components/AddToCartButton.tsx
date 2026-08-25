"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({
  product,
  outOfStock,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    brandName: string;
    categorySlug: string;
  };
  outOfStock: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={() => {
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceCents: product.priceCents,
          brandName: product.brandName,
          categorySlug: product.categorySlug,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="mt-2 w-fit rounded-full bg-accent px-6 py-2 text-sm font-medium text-accent-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
    >
      {outOfStock ? "Rupture de stock" : added ? "Ajouté ✓" : "Ajouter au panier"}
    </button>
  );
}

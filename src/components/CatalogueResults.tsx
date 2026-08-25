"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { groupByType, type CardProduct } from "@/lib/product-display";
import { slugifyType } from "@/lib/product-type";

const BATCH_SIZE = 24;

export function CatalogueResults({
  products,
  wishlistedIds,
}: {
  products: CardProduct[];
  wishlistedIds: string[];
}) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const wishlisted = new Set(wishlistedIds);

  const visibleProducts = products.slice(0, visibleCount);
  const groups = groupByType(visibleProducts);
  const hasMore = visibleCount < products.length;

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.type} id={`type-${slugifyType(group.type)}`} className="flex scroll-mt-24 flex-col gap-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/50">
            {group.type}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {group.products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                wishlisted={wishlisted.has(product.id)}
              />
            ))}
          </div>
        </section>
      ))}

      {hasMore ? (
        <div className="flex flex-col items-center gap-2 pt-4">
          <p className="text-xs text-foreground/50">
            {visibleProducts.length} sur {products.length} produits affichés
          </p>
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}
            className="btn-secondary"
          >
            Voir plus de produits
          </button>
        </div>
      ) : null}
    </div>
  );
}

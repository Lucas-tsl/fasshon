"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";

export function CartLink() {
  const { items, count, subtotalCents, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-1 transition-colors hover:text-accent"
      >
        Panier
        {count > 0 ? (
          <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-xs text-accent-foreground animate-fade-in">
            {count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-20 mt-2 flex w-80 flex-col gap-3 rounded-xl border border-border bg-background p-4 shadow-lg shadow-black/5 animate-fade-in">
          {items.length === 0 ? (
            <p className="text-sm text-foreground/60">Votre panier est vide.</p>
          ) : (
            <>
              <ul className="flex max-h-64 flex-col gap-3 overflow-y-auto">
                {items.map((item) => (
                  <li
                    key={`${item.productId}:${item.variantId ?? ""}`}
                    className="flex items-center gap-3"
                  >
                    <ProductImage
                      images={item.image ? [item.image] : []}
                      name={item.name}
                      categorySlug={item.categorySlug}
                      className="h-12 w-12 shrink-0"
                      sizes="48px"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-foreground/60">
                        {item.quantity} × {formatPrice(item.priceCents)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-xs text-foreground/40 hover:text-foreground"
                      aria-label={`Retirer ${item.name}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-semibold">
                <span>Sous-total</span>
                <span>{formatPrice(subtotalCents)}</span>
              </div>
            </>
          )}

          <Link
            href="/panier"
            onClick={() => setOpen(false)}
            className="rounded-full bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Voir le panier
          </Link>
        </div>
      ) : null}
    </div>
  );
}

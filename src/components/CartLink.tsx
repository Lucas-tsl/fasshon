"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 8h12l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

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
        aria-label="Panier"
        title="Panier"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground"
      >
        <CartIcon />
        {count > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground animate-fade-in">
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
            className="btn-primary w-full"
          >
            Voir le panier
          </Link>
        </div>
      ) : null}
    </div>
  );
}

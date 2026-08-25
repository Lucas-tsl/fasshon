"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";

export default function PanierPage() {
  const { items, setQuantity, removeItem, subtotalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Impossible de contacter le serveur de paiement.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Votre panier est vide</h1>
        <Link href="/produits" className="text-accent hover:underline">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Votre panier</h1>

      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 border-b border-border pb-4">
            <ProductImagePlaceholder
              name={item.name}
              categorySlug={item.categorySlug}
              className="h-16 w-16 shrink-0"
            />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-foreground/50">{item.brandName}</p>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-sm text-foreground/60">{formatPrice(item.priceCents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                className="h-7 w-7 rounded-full border border-border"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                className="h-7 w-7 rounded-full border border-border"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right text-sm font-semibold">
              {formatPrice(item.priceCents * item.quantity)}
            </p>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="text-xs text-foreground/50 hover:text-foreground"
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between text-lg font-semibold">
        <span>Total</span>
        <span>{formatPrice(subtotalCents)}</span>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground disabled:opacity-50"
      >
        {loading ? "Redirection vers le paiement…" : "Passer commande"}
      </button>
    </div>
  );
}

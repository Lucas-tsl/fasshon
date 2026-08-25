"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TrashIcon } from "@/components/TrashIcon";

function CheckoutSteps({ step }: { step: 1 | 2 }) {
  return (
    <ol className="flex items-center gap-2 text-xs text-foreground/50">
      <li className={`flex items-center gap-1.5 ${step === 1 ? "font-medium text-accent" : ""}`}>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${step === 1 ? "border-accent bg-accent text-accent-foreground" : "border-border"}`}
        >
          1
        </span>
        Panier
      </li>
      <span aria-hidden="true">—</span>
      <li className={`flex items-center gap-1.5 ${step === 2 ? "font-medium text-accent" : ""}`}>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${step === 2 ? "border-accent bg-accent text-accent-foreground" : "border-border"}`}
        >
          2
        </span>
        Paiement sécurisé
      </li>
    </ol>
  );
}

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
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
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
        <Breadcrumb items={[{ label: "Panier" }]} />
        <h1 className="font-display text-3xl">Votre panier est vide</h1>
        <Link href="/produits" className="text-accent hover:underline">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "Panier" }]} />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Votre panier</h1>
        <CheckoutSteps step={1} />
      </div>

      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={`${item.productId}:${item.variantId ?? ""}`}
            className="flex items-center gap-4 border-b border-border pb-4"
          >
            <ProductImage
              images={item.image ? [item.image] : []}
              name={item.name}
              categorySlug={item.categorySlug}
              className="h-16 w-16 shrink-0"
              sizes="64px"
            />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-foreground/50">{item.brandName}</p>
              <p className="text-sm font-medium">{item.name}</p>
              {item.variantName ? (
                <p className="text-xs text-foreground/50">{item.variantName}</p>
              ) : null}
              <p className="text-sm text-foreground/60">{formatPrice(item.priceCents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.variantId, item.quantity - 1)}
                className="h-7 w-7 rounded-full border border-border transition hover:border-accent"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.variantId, item.quantity + 1)}
                className="h-7 w-7 rounded-full border border-border transition hover:border-accent"
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
              onClick={() => removeItem(item.productId, item.variantId)}
              aria-label="Retirer du panier"
              className="text-foreground/70 hover:text-foreground"
            >
              <TrashIcon />
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
        className="btn-primary w-full"
      >
        {loading ? "Redirection vers le paiement…" : "Passer commande"}
      </button>

      <Link href="/produits" className="text-center text-sm text-foreground/60 hover:underline">
        Continuer mes achats
      </Link>
    </div>
  );
}

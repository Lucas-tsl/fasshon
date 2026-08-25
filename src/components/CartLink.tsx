"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link href="/panier" className="relative transition-colors hover:text-accent">
      Panier
      {count > 0 ? (
        <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-xs text-accent-foreground transition-transform animate-fade-in">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

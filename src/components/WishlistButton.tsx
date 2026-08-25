"use client";

import { useState, useTransition } from "react";
import { toggleWishlist } from "@/app/wishlist-actions";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 21s-6.7-4.35-9.3-8.2C1 10.1 1.6 6.6 4.6 5.1c2.3-1.15 4.8-.3 6.4 1.6l1 1.2 1-1.2c1.6-1.9 4.1-2.75 6.4-1.6 3 1.5 3.6 5 1.9 7.7C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

export function WishlistButton({
  productId,
  initialWishlisted = false,
  compact = false,
}: {
  productId: string;
  initialWishlisted?: boolean;
  compact?: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [pending, startTransition] = useTransition();
  const [popping, setPopping] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !wishlisted;
    setWishlisted(next);
    setPopping(true);
    startTransition(async () => {
      const result = await toggleWishlist(productId);
      setWishlisted(result.wishlisted);
    });
  }

  const heart = (
    <span
      className={`inline-flex ${popping ? "heart-pop" : ""}`}
      onAnimationEnd={() => setPopping(false)}
    >
      <HeartIcon filled={wishlisted} />
    </span>
  );

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={wishlisted ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
        aria-pressed={wishlisted}
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm transition-colors ${
          wishlisted ? "text-accent" : "text-foreground/60 hover:text-accent"
        }`}
      >
        {heart}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={wishlisted}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
        wishlisted
          ? "border-accent text-accent"
          : "border-border text-foreground/70 hover:border-accent hover:text-accent"
      }`}
    >
      {heart}
      {wishlisted ? "Dans ma liste" : "Ajouter à ma liste"}
    </button>
  );
}

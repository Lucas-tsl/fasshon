"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function MobileMenu({ brands }: { brands: { slug: string; name: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Portalé hors du header : le header a un backdrop-blur, qui crée un
  // containing block pour les descendants en position fixed — sans le
  // portail, "fixed inset-0" se positionnerait par rapport au header
  // (~60px) au lieu du viewport entier.
  const panel = open ? (
    <div className="fixed inset-0 z-40 flex flex-col bg-background md:hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-display text-2xl tracking-wide">Fasshon</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
        <Link
          href="/produits"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-3 text-lg font-medium transition-colors hover:bg-muted"
        >
          Catalogue
        </Link>
        <Link
          href="/blog"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-3 text-lg font-medium transition-colors hover:bg-muted"
        >
          Blog
        </Link>

        <p className="mt-4 px-3 text-xs font-semibold tracking-widest text-foreground/50 uppercase">
          Marques
        </p>
        <Link
          href="/marques"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-2.5 text-base transition-colors hover:bg-muted"
        >
          Toutes les marques
        </Link>
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/marques/${brand.slug}`}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-base text-foreground/70 transition-colors hover:bg-muted"
          >
            {brand.name}
          </Link>
        ))}
      </nav>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 md:hidden"
      >
        <MenuIcon />
      </button>
      {panel ? createPortal(panel, document.body) : null}
    </>
  );
}

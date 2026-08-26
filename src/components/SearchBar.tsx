"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  const overlay = open ? (
    <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Recherche">
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative border-b border-border bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-6">
          <span className="text-foreground/40">
            <SearchIcon size={22} />
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit, une marque, un article..."
            className="min-w-0 flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-foreground/30"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer la recherche"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-foreground/60 hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher"
        title="Rechercher"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground"
      >
        <SearchIcon />
      </button>
      {overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}

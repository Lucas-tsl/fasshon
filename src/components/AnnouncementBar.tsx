"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "✨ 4 marques françaises réunies dans une seule boutique",
  "🔒 Paiement 100% sécurisé",
  "📦 Livraison suivie partout en France",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-8 items-center justify-center overflow-hidden bg-surface-inverse px-4 text-center text-xs font-medium text-foreground-inverse">
      <span key={index} className="animate-fade-in">
        {MESSAGES[index]}
      </span>
    </div>
  );
}

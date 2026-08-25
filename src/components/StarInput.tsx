"use client";

import { useState } from "react";

export function StarInput({ name, defaultValue = 5 }: { name: string; defaultValue?: number }) {
  const [value, setValue] = useState(defaultValue);
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={value} />
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => setValue(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          aria-label={`${i} étoile${i > 1 ? "s" : ""}`}
          className="text-accent"
        >
          <svg viewBox="0 0 20 20" width="24" height="24" aria-hidden="true">
            <path
              d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 6-5.2-2.8-5.2 2.8 1-6-4.3-4.2 5.9-.8L10 1.5z"
              fill={display >= i ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

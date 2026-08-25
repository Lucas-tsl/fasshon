"use client";

import { useEffect, useRef, useState } from "react";
import { slugifyType, shortTypeLabel } from "@/lib/product-type";

export function TypeQuickNav({ types }: { types: string[] }) {
  const [active, setActive] = useState(types[0] ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = types
      .map((t) => document.getElementById(`type-${slugifyType(t)}`))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        setActive(topMost.target.id.replace("type-", ""));
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [types]);

  if (types.length < 2) return null;

  function handleClick(type: string) {
    const el = document.getElementById(`type-${slugifyType(type)}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div
        ref={containerRef}
        className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto rounded-full bg-foreground p-1.5 text-background shadow-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {types.map((type) => {
          const slug = slugifyType(type);
          const isActive = active === slug;
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleClick(type)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                isActive ? "bg-background text-foreground" : "text-background/70 hover:text-background"
              }`}
            >
              {shortTypeLabel(type)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

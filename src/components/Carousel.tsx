"use client";

import { useRef, type ReactNode } from "react";

export function Carousel({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  return (
    <div className="group/carousel relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Précédent"
        className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-2 opacity-0 shadow-md transition-opacity group-hover/carousel:opacity-100 sm:flex"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Suivant"
        className="absolute right-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background p-2 opacity-0 shadow-md transition-opacity group-hover/carousel:opacity-100 sm:flex"
      >
        →
      </button>
    </div>
  );
}

export function CarouselItem({ children }: { children: ReactNode }) {
  return (
    <div className="w-[45%] shrink-0 snap-start sm:w-[30%] md:w-[22%]">{children}</div>
  );
}

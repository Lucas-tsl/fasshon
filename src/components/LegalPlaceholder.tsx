import type { ReactNode } from "react";

export function LegalPlaceholder({ children }: { children: ReactNode }) {
  return <span className="rounded bg-accent/15 px-1.5 py-0.5 text-accent">{children}</span>;
}

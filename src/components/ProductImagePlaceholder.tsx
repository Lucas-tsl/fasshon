const PALETTES: Record<string, [string, string]> = {
  maquillage: ["#f0d9c8", "#c9834b"],
  soins: ["#e3ecdd", "#8ba672"],
  "bien-etre": ["#e6e1d8", "#a99a7d"],
  senteurs: ["#f5d0a9", "#c98a4b"],
};

const DEFAULT_PALETTE: [string, string] = ["#e5e5e5", "#a3a3a3"];

export function ProductImagePlaceholder({
  name,
  categorySlug,
  className,
}: {
  name: string;
  categorySlug: string;
  className?: string;
}) {
  const [from, to] = PALETTES[categorySlug] ?? DEFAULT_PALETTE;
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg ${className ?? ""}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <span className="text-4xl font-semibold text-white/80">{initial}</span>
      <span className="absolute bottom-2 right-2 rounded bg-black/30 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white">
        Photo à venir
      </span>
    </div>
  );
}

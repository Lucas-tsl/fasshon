const BADGES = [
  { icon: "🔒", label: "Paiement 100% sécurisé" },
  { icon: "📦", label: "Livraison suivie" },
  { icon: "↩️", label: "Retours sous 14 jours" },
  { icon: "🇫🇷", label: "Marques françaises authentiques" },
];

export function TrustBadges({ className }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 text-center sm:grid-cols-4 ${className ?? ""}`}
    >
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex flex-col items-center gap-1.5 px-2">
          <span className="text-xl" aria-hidden="true">
            {badge.icon}
          </span>
          <span className="text-xs text-foreground/60">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

function FrenchFlag() {
  // SVG plutôt qu'un emoji drapeau : les émojis "flag" (paires d'indicateurs
  // régionaux) ne s'affichent pas sur Windows, qui montre "FR" en texte brut.
  return (
    <svg viewBox="0 0 3 2" className="h-5 w-[1.875rem] rounded-[2px]" aria-hidden="true">
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#ffffff" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  );
}

const BADGES = [
  { icon: "🔒", label: "Paiement 100% sécurisé" },
  { icon: "📦", label: "Livraison suivie" },
  { icon: "↩️", label: "Retours sous 14 jours" },
  { icon: <FrenchFlag />, label: "Marques françaises authentiques" },
];

export function TrustBadges({ className }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 text-center sm:grid-cols-4 ${className ?? ""}`}
    >
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex flex-col items-center gap-1.5 px-2">
          <span className="flex h-6 items-center justify-center text-xl" aria-hidden="true">
            {badge.icon}
          </span>
          <span className="text-xs text-foreground/60">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

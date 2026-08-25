// Balise <img> native plutôt que next/image : les 4 logos ont des ratios
// très différents (ex. 12:1 pour Physiomins, 2:1 pour JOZZ) et on veut que
// chacun garde ses proportions réelles à hauteur fixe — next/image impose
// un aspect-ratio figé à partir de width/height, ce qui écrasait les logos
// les plus larges. Fichiers minuscules (quelques Ko) : le coût LCP que
// next/image évite habituellement n'entre pas en jeu ici.
export function BrandLogo({
  name,
  logoPath,
  className,
}: {
  name: string;
  logoPath: string | null;
  className?: string;
}) {
  if (!logoPath) {
    return <span className={`font-medium ${className ?? ""}`}>{name}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoPath} alt={name} className={`w-auto object-contain ${className ?? "h-8"}`} />
  );
}

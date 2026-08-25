// Déduit un "type" lisible à partir du nom du produit, pour regrouper le
// catalogue par famille (palettes, soins, coffrets...) indépendamment des
// catégories marketing propres à chaque marque (souvent trop spécifiques
// ou incohérentes d'un export à l'autre). Les règles fortes et sans
// ambiguïté (coffret, calendrier...) sont testées en premier ; les
// signaux faibles ("kit", "set", très employés dans des sens différents)
// en dernier recours seulement.

type Rule = { type: string; keywords: string[] };

const RULES: Rule[] = [
  { type: "Coffrets & Sets cadeaux", keywords: ["coffret", "calendrier", "cracker", "cadeau"] },
  { type: "Accessoires & Trousses", keywords: ["porte-clés", "porte-cles"] },
  { type: "Vernis & Ongles", keywords: ["vernis", "manucure", "nail"] },
  { type: "Mascaras & Cils", keywords: ["mascara", "cils", "lash"] },
  { type: "Palettes & Maquillage yeux", keywords: ["palette", "fards", "eyeliner", "liner", "eyessentials"] },
  {
    type: "Teint",
    keywords: ["fond de teint", "poudre", "highlighter", "illuminat", "bronzer", "blush", "fixateur"],
  },
  { type: "Lèvres", keywords: ["lèvres", "levres", "gloss", "baume"] },
  { type: "Solaire", keywords: ["solaire", "spf"] },
  { type: "Gommages & Exfoliants", keywords: ["gommage", "exfoliant"] },
  { type: "Nettoyants & Démaquillants", keywords: ["démaquill", "demaquill", "nettoyant", "micellaire", "lotion"] },
  { type: "Corps & Bain", keywords: ["huile", "corps", "mains"] },
  { type: "Aromathérapie", keywords: ["roll-on", "aroma"] },
  { type: "Déodorants", keywords: ["déodorant", "deodorant"] },
  { type: "Brumes & Eaux parfumées", keywords: ["brume", "energisante", "énergisante", "l'eau"] },
  { type: "Sérums, crèmes & soins visage", keywords: ["sérum", "serum", "crème", "creme", "concentré", "concentre", "fluide", "masque", "soin"] },
  { type: "Compléments & Bien-être", keywords: ["cure", "complément", "complement", "barre", "collagène", "collagene", "drainant", "protéin", "proteine"] },
  { type: "Épilation", keywords: ["dépilatoire", "depilatoire"] },
  { type: "Accessoires & Trousses", keywords: ["trousse", "sac ", "vanity", "pinceau", "chouchou", "bougie", "vaporisateur", "pochon"] },
  { type: "Sets & Kits", keywords: ["kit", " set", "set "] },
];

export function inferProductType(name: string): string {
  const lower = name.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.type;
    }
  }
  return "Autres";
}

// Ordre d'affichage préféré des types (celui des règles ci-dessus, sans
// doublons), avec "Autres" toujours en dernier.
export const PRODUCT_TYPE_ORDER: string[] = [
  ...Array.from(new Set(RULES.map((r) => r.type))),
  "Autres",
];

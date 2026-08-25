// Déduit un "type" lisible à partir du nom du produit, pour regrouper le
// catalogue par famille (palettes, soins, coffrets...) indépendamment des
// catégories marketing propres à chaque marque (souvent trop spécifiques
// ou incohérentes d'un export à l'autre). Les règles fortes et sans
// ambiguïté (coffret, calendrier...) sont testées en premier ; les
// signaux faibles ("kit", "set", très employés dans des sens différents)
// en dernier recours seulement.
//
// Utilisée telle quelle pour JOZZ Beauty et Pur Eden (le nom du produit
// suffit). Les Senteurs Gourmandes et Physiomins ont leur propre
// classificateur (scripts/import-lsg-scraped.ts, scripts/import-physiomins.ts)
// car leurs catégories réelles sont bien plus fiables que le nom seul.

type Rule = { type: string; keywords: string[] };

const RULES: Rule[] = [
  { type: "Coffrets & Sets cadeaux", keywords: ["coffret", "calendrier", "cracker", "cadeau"] },
  { type: "Accessoires & Divers", keywords: ["porte-clés", "porte-cles"] },
  // "Brumes" doit être vérifié avant "Parfums" : une brume est aussi taguée
  // "parfumée" dans ses catégories, le mot "parfum" seul ne doit donc pas
  // l'emporter sur le signal plus précis "brume".
  { type: "Brumes & Eaux parfumées", keywords: ["brume", "energisante", "énergisante", "l'eau"] },
  { type: "Parfums", keywords: ["eau de parfum", "eaux de parfum", "parfum"] },
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
  { type: "Corps & Bain", keywords: ["huile", "corps", "mains", "gel douche", "shampoing"] },
  { type: "Aromathérapie", keywords: ["roll-on", "aroma"] },
  { type: "Déodorants", keywords: ["déodorant", "deodorant"] },
  { type: "Sérums, crèmes & soins visage", keywords: ["sérum", "serum", "crème", "creme", "concentré", "concentre", "fluide", "masque", "soin"] },
  { type: "Compléments & Bien-être", keywords: ["cure", "complément", "complement", "barre", "collagène", "collagene", "drainant", "protéin", "proteine"] },
  { type: "Épilation", keywords: ["dépilatoire", "depilatoire"] },
  {
    type: "Accessoires & Divers",
    keywords: ["trousse", "sac ", "vanity", "pinceau", "chouchou", "bougie", "vaporisateur", "pochon", "kit", " set", "set "],
  },
];

// Libellés courts pour la barre de navigation par type (espace limité) —
// le nom complet reste utilisé partout ailleurs (titres de section, filtres).
const SHORT_LABELS: Record<string, string> = {
  "Coffrets & Sets cadeaux": "Coffrets",
  "Accessoires & Divers": "Accessoires",
  "Brumes & Eaux parfumées": "Brumes",
  "Vernis & Ongles": "Ongles",
  "Mascaras & Cils": "Cils",
  "Palettes & Maquillage yeux": "Yeux",
  "Gommages & Exfoliants": "Gommages",
  "Nettoyants & Démaquillants": "Nettoyants",
  "Corps & Bain": "Corps",
  "Aromathérapie": "Aroma",
  "Sérums, crèmes & soins visage": "Soins visage",
  "Compléments & Bien-être": "Compléments",
  "Plats & Repas protéinés": "Plats",
  "Entrées & Apéritif": "Apéritif",
  "Desserts & Douceurs": "Desserts",
  "Digestifs & Microbiote": "Digestifs",
  "Minceur & Drainage": "Minceur",
};

export function shortTypeLabel(type: string): string {
  return SHORT_LABELS[type] ?? type.split(/[&,]/)[0]!.trim();
}

export function slugifyType(type: string): string {
  return type
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function inferProductType(name: string): string {
  const lower = name.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.type;
    }
  }
  return "Autres";
}

// Ordre d'affichage préféré des types, choisi explicitement (indépendant
// de l'ordre des règles ci-dessus) pour satisfaire l'ordre voulu par
// marque une fois filtré à ses propres types : LSG doit afficher Brumes,
// Coffrets, Parfums puis Accessoires ; JOZZ doit afficher Lèvres, Teint,
// Yeux, Ongles, Coffrets puis Autres. Un seul ordre global peut satisfaire
// les deux car chaque marque ne voit que ses propres types filtrés.
export const PRODUCT_TYPE_ORDER: string[] = [
  "Brumes & Eaux parfumées",
  "Lèvres",
  "Teint",
  "Palettes & Maquillage yeux",
  "Vernis & Ongles",
  "Coffrets & Sets cadeaux",
  "Parfums",
  "Accessoires & Divers",
  "Mascaras & Cils",
  "Solaire",
  "Gommages & Exfoliants",
  "Nettoyants & Démaquillants",
  "Corps & Bain",
  "Aromathérapie",
  "Déodorants",
  "Sérums, crèmes & soins visage",
  "Compléments & Bien-être",
  "Épilation",
  "Plats & Repas protéinés",
  "Entrées & Apéritif",
  "Desserts & Douceurs",
  "Digestifs & Microbiote",
  "Minceur & Drainage",
  "Autres",
];

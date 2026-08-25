// Classement dédié Pur Eden en 4 familles simples (le classificateur
// générique product-type.ts reste utilisé pour JOZZ Beauty).
export function classifyPurEden(name: string): string {
  const n = name.toLowerCase();

  if (/nettoyant|démaquillant|demaquillant|micellaire|lotion|peau nette/.test(n)) return "Nettoyant";
  if (/solaire|spf/.test(n)) return "Protection";
  if (/hydratant|hydratante|crème mains|creme mains|huile sèche|huile seche/.test(n)) return "Hydratant";
  return "soins";
}

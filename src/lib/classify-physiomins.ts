// Classement dédié Physiomins en 6 familles simples, choisies pour
// coller à la façon dont la marque doit être parcourue sur le site
// (plutôt que le détail des catégories du fournisseur). "Anti-gaspi"
// est prévu structurellement mais aucun produit de l'export actuel ne
// correspond à un signal fiable (ni le nom, ni la catégorie fournisseur
// ne l'indiquent) — la règle est prête si une prochaine extraction
// distingue ces produits.
export function classifyPhysiomins(name: string, category: string): string {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  if (/gourde|shaker|brosse|roller/.test(n)) return "Accessoire";
  if (/\bcure\b/.test(n)) return "Cures";
  if (/anti-?gaspi|destockage|déstockage/.test(n) || /anti-?gaspi/.test(c)) return "Anti-gaspi";
  // Les produits topiques (crèmes, huiles, gels effet froid) n'ont pas de
  // catégorie fournisseur dédiée : ils sont rangés avec les compléments
  // minceur ("Minceur", "Draineurs...") côté fournisseur, d'où le repli
  // sur des mots du nom pour les repérer. La catégorie "Peau"/"Cheveux"
  // fournisseur n'est volontairement pas utilisée ici : elle contient
  // aussi bien des crèmes que des compléments ingérables (ex. "Beauté",
  // "Éclat" sont des compléments en gélules, pas des crèmes).
  if (/cr[eè]me|huile|cellulite|cryo/.test(n)) return "Crème";
  if (/nutrition|petit-déjeuner|petit dejeuner|substituts|soupes|plats|snack|apéritif|aperitif|boisson/.test(c))
    return "Nutrition";
  return "Complément";
}

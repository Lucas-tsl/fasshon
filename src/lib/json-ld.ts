/** Sérialise un objet pour un <script type="application/ld+json">, en
 * échappant "<" pour empêcher une fermeture prématurée de la balise si le
 * contenu (avis, FAQ...) contenait par hasard "</script>". */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

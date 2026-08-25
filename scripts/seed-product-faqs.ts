// Génère des FAQ génériques par type de produit (contenu factuel et sûr :
// livraison/retours alignés sur les informations déjà affichées ailleurs
// sur le site, rien de spécifique à un ingrédient/usage qu'on ne peut pas
// garantir). À affiner produit par produit si besoin plus tard.
//
// Usage : npx tsx --env-file=.env scripts/seed-product-faqs.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

type Faq = { question: string; answer: string };

const UNIVERSAL: Faq[] = [
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Les commandes sont expédiées avec un numéro de suivi, généralement sous 2 à 5 jours ouvrés selon votre localisation.",
  },
  {
    question: "Puis-je retourner ce produit ?",
    answer: "Oui, vous disposez de 14 jours après réception pour nous retourner un produit non utilisé dans son emballage d'origine.",
  },
];

const BY_TYPE: Record<string, Faq[]> = {
  Parfums: [
    { question: "Combien de temps tient ce parfum ?", answer: "La tenue varie selon la peau, comptez en moyenne 4 à 6 heures pour une eau de parfum, avec un sillage plus discret au fil de la journée." },
    { question: "Comment bien l'appliquer ?", answer: "Vaporisez sur les points de pulsation (poignets, cou) à quelques centimètres de la peau, sans frotter, pour préserver les notes du parfum." },
  ],
  "Brumes & Eaux parfumées": [
    { question: "Peut-on l'utiliser sur les cheveux et les vêtements ?", answer: "Oui, cette brume est formulée pour un usage corps, cheveux et textiles, à distance raisonnable pour éviter les auréoles." },
    { question: "Combien de temps tient le parfum ?", answer: "Une brume est plus légère qu'une eau de parfum, comptez 2 à 3 heures de tenue selon la peau." },
  ],
  "Coffrets & Sets cadeaux": [
    { question: "Ce coffret est-il livré emballé pour offrir ?", answer: "Le coffret est livré dans son packaging d'origine, déjà pensé pour être offert tel quel." },
    { question: "Le contenu du coffret est-il personnalisable ?", answer: "Non, la composition du coffret est fixe et identique à celle présentée sur la fiche produit." },
  ],
  "Vernis & Ongles": [
    { question: "Combien de temps tient ce vernis ?", answer: "Comptez en moyenne 5 à 7 jours sans écaillage avec une base et une top coat adaptées." },
    { question: "Comment le retirer ?", answer: "Un dissolvant classique sans acétone agressif suffit, sur un coton, sans frotter trop fort." },
  ],
  "Mascaras & Cils": [
    { question: "Ce mascara est-il waterproof ?", answer: "Reportez-vous à la description du produit : certaines références de la gamme sont waterproof, d'autres non." },
    { question: "Convient-il aux yeux sensibles ?", answer: "La formule est testée pour un usage courant, mais en cas de sensibilité oculaire particulière, un avis ophtalmologique reste recommandé." },
  ],
  "Palettes & Maquillage yeux": [
    { question: "Les teintes sont-elles pigmentées ?", answer: "Oui, la palette est conçue pour une bonne tenue et un rendu pigmenté dès la première couche." },
    { question: "Peut-on l'utiliser avec les doigts ou faut-il un pinceau ?", answer: "Les deux fonctionnent : un pinceau donnera un rendu plus précis, les doigts un effet plus estompé." },
  ],
  Teint: [
    { question: "Convient-il à tous les types de peau ?", answer: "La formule convient à la majorité des carnations et types de peau ; en cas de doute, un test au creux du poignet est recommandé." },
    { question: "Comment conserver ce produit ?", answer: "Conservez-le à température ambiante, à l'abri de la lumière directe et de l'humidité." },
  ],
  Lèvres: [
    { question: "Ce produit est-il longue tenue ?", answer: "Se référer à la description : les formules encre/laque tiennent plus longtemps qu'un rouge à lèvres classique." },
    { question: "Comment le retirer en fin de journée ?", answer: "Un démaquillant biphasé retire plus facilement les formules longue tenue qu'un simple coton humide." },
  ],
  Solaire: [
    { question: "Quelle quantité appliquer ?", answer: "Appliquez généreusement 15 à 20 minutes avant l'exposition, et renouvelez toutes les 2 heures ou après une baignade." },
    { question: "Ce produit est-il résistant à l'eau ?", answer: "Se référer à l'indication water resistant sur l'emballage ; une nouvelle application après la baignade reste recommandée." },
  ],
  "Gommages & Exfoliants": [
    { question: "À quelle fréquence l'utiliser ?", answer: "Une à deux fois par semaine suffit pour éviter d'irriter la peau." },
    { question: "Convient-il aux peaux sensibles ?", answer: "Les grains sont doux, mais en cas de peau très réactive, testez sur une petite zone avant utilisation complète." },
  ],
  "Nettoyants & Démaquillants": [
    { question: "Convient-il aux yeux sensibles ?", answer: "Oui, la formule est adaptée au démaquillage du visage et des yeux, y compris avec du maquillage waterproof pour les versions biphasées." },
    { question: "Faut-il rincer après application ?", answer: "Selon le produit un rinçage à l'eau claire est recommandé ; se référer au mode d'emploi sur l'emballage." },
  ],
  "Corps & Bain": [
    { question: "À quelle fréquence l'utiliser ?", answer: "Un usage quotidien est adapté pour la plupart des soins corps de cette gamme." },
    { question: "Convient-il aux peaux sensibles ?", answer: "La formule est pensée pour un usage courant ; testez sur une petite zone en cas de peau très réactive." },
  ],
  Aromathérapie: [
    { question: "Comment utiliser ce roll-on ?", answer: "Appliquez sur les points de pulsation (poignets, tempes) et respirez profondément, jusqu'à 3 fois par jour." },
    { question: "Y a-t-il des précautions d'usage ?", answer: "Comme tout produit à base d'huiles essentielles, il est déconseillé aux femmes enceintes/allaitantes et aux jeunes enfants sans avis médical." },
  ],
  Déodorants: [
    { question: "Ce déodorant contient-il des sels d'aluminium ?", answer: "Se référer à la liste d'ingrédients sur l'emballage pour la composition exacte." },
    { question: "Combien de temps dure la protection ?", answer: "Une protection 24h est visée pour un usage quotidien classique." },
  ],
  "Sérums, crèmes & soins visage": [
    { question: "Dans quel ordre l'appliquer dans ma routine ?", answer: "En général : nettoyant, sérum, puis crème hydratante, sur peau propre et sèche." },
    { question: "Convient-il aux peaux sensibles ?", answer: "La formule est conçue pour un usage courant ; effectuez un test sur une petite zone si votre peau est très réactive." },
  ],
  "Compléments & Bien-être": [
    { question: "Quelle est la posologie recommandée ?", answer: "Se référer aux instructions figurant sur l'emballage du produit pour la dose journalière conseillée." },
    { question: "Ce complément convient-il en cas de grossesse ?", answer: "Demandez toujours l'avis d'un professionnel de santé avant toute prise de complément alimentaire en cas de grossesse ou allaitement." },
  ],
  Épilation: [
    { question: "Comment utiliser ce produit ?", answer: "Appliquez sur peau propre et sèche en suivant le mode d'emploi indiqué sur l'emballage." },
    { question: "Convient-il aux peaux sensibles ?", answer: "Un test sur une petite zone est recommandé avant la première utilisation." },
  ],
  "Accessoires & Divers": [
    { question: "Comment entretenir cet accessoire ?", answer: "Un nettoyage régulier à l'eau tiède ou avec un chiffon doux suffit selon la matière ; évitez les produits abrasifs." },
    { question: "Cet accessoire est-il livré tel que présenté en photo ?", answer: "Oui, l'accessoire correspond aux visuels de la fiche produit, dans les coloris disponibles indiqués." },
  ],
  "Plats & Repas protéinés": [
    { question: "Quels sont les allergènes possibles ?", answer: "Reportez-vous à la liste d'ingrédients sur l'emballage : certaines recettes contiennent du lait, du soja ou du gluten." },
    { question: "Comment préparer ce produit ?", answer: "Suivez le mode de préparation indiqué sur l'emballage (généralement à réhydrater à l'eau chaude ou au lait)." },
  ],
  "Entrées & Apéritif": [
    { question: "Quels sont les allergènes possibles ?", answer: "Reportez-vous à la liste d'ingrédients sur l'emballage pour connaître les allergènes présents." },
    { question: "Comment conserver ce produit ?", answer: "Conservez-le au sec, à température ambiante, et refermez bien l'emballage après ouverture." },
  ],
  "Desserts & Douceurs": [
    { question: "Quels sont les allergènes possibles ?", answer: "Reportez-vous à la liste d'ingrédients sur l'emballage : lait, œufs, fruits à coque ou gluten selon les recettes." },
    { question: "Ce produit convient-il aux sportifs ?", answer: "Ces recettes sont enrichies en protéines et pensées pour s'intégrer à une alimentation active, en complément d'une alimentation équilibrée." },
  ],
  "Digestifs & Microbiote": [
    { question: "Quelle est la posologie recommandée ?", answer: "Se référer aux instructions figurant sur l'emballage pour la prise journalière conseillée." },
    { question: "Combien de temps avant de voir des effets ?", answer: "Les effets sur le confort digestif varient selon les personnes ; une cure de plusieurs semaines est généralement conseillée pour en juger." },
  ],
  "Minceur & Drainage": [
    { question: "Quelle est la posologie recommandée ?", answer: "Se référer aux instructions figurant sur l'emballage pour la dose journalière conseillée." },
    { question: "Ce produit remplace-t-il une alimentation équilibrée ?", answer: "Non, il s'agit d'un complément à associer à une alimentation équilibrée et une activité physique régulière." },
  ],
};

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, productType: true, name: true } });
  let created = 0;

  for (const product of products) {
    const existing = await prisma.productFaq.count({ where: { productId: product.id } });
    if (existing > 0) continue;

    const typeFaqs = (product.productType && BY_TYPE[product.productType]) || [];
    const faqs = [...typeFaqs, ...UNIVERSAL];

    await prisma.productFaq.createMany({
      data: faqs.map((faq, i) => ({
        productId: product.id,
        question: faq.question,
        answer: faq.answer,
        position: i,
      })),
    });
    created += faqs.length;
  }

  console.log(`${created} FAQ créées sur ${products.length} produits.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Articles de blog d'exemple pour visualiser le rendu de la fonctionnalité.
// Contenu original écrit pour Fasshon (pas de reprise d'un tiers).
// Usage : npx tsx --env-file=.env scripts/seed-blog-posts.ts

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const POSTS = [
  {
    slug: "bien-choisir-son-parfum-d-ambiance",
    title: "Bien choisir son parfum d'ambiance",
    excerpt: "Notes de tête, de cœur, de fond : quelques repères simples pour trouver la fragrance qui vous ressemble.",
    coverImage: "/products/les-senteurs-gourmandes/amber-oud-30D2304916.webp",
    content: `Choisir un parfum, c'est avant tout une histoire de patience. Une fragrance évolue en trois temps : les notes de tête, perçues dans les premières minutes, puis les notes de cœur qui s'installent, et enfin les notes de fond qui persistent plusieurs heures sur la peau.

Avant d'acheter, laissez toujours le parfum se poser au moins quinze minutes avant de juger. Les premières impressions sont souvent trompeuses : une senteur peut paraître forte en sortie de flacon et devenir beaucoup plus douce une fois développée sur la peau.

Chez Les Senteurs Gourmandes, les compositions jouent volontiers sur des accords gourmands (vanille, fruits, ambre) qui apportent une chaleur immédiate, tout en gardant une tenue honnête sur la journée. Pour un premier achat, les formats 15 ml ou 30 ml sont une bonne façon de tester une fragrance sans s'engager sur un grand flacon.

Enfin, pensez à la saison : les notes boisées et ambrées se prêtent bien à l'automne et l'hiver, tandis que les agrumes et fleurs blanches sont plus à leur place au printemps et en été.`,
  },
  {
    slug: "routine-maquillage-rentree",
    title: "Notre sélection maquillage pour la rentrée",
    excerpt: "Trois indispensables pour une routine maquillage rapide et efficace en cette rentrée.",
    coverImage: "/products/jozz-beauty/all-in-one-glam-palette-2.png",
    content: `La rentrée rime souvent avec routines plus courtes le matin. Voici une sélection pensée pour un maquillage efficace en quelques minutes.

Une palette polyvalente reste la base la plus rentable : elle permet de composer un look jour comme soir sans multiplier les produits. Privilégiez des teintes neutres qui se marient facilement entre elles.

Pour le teint, un produit multi-usage (blush, enlumineur, fond de teint léger) simplifie considérablement la routine sans sacrifier le résultat. C'est particulièrement pratique pour les trajets ou les retouches en journée.

Enfin, misez sur un ou deux produits longue tenue pour les lèvres et les yeux : ils tiennent mieux dans la durée et évitent les retouches répétées. L'objectif n'est pas d'avoir plus de produits, mais des produits qui font plusieurs choses à la fois.`,
  },
  {
    slug: "trois-reflexes-bien-etre-au-quotidien",
    title: "Trois réflexes bien-être au quotidien",
    excerpt: "De petites habitudes simples à intégrer à votre quotidien, entre alimentation, hydratation et repos.",
    coverImage: "/products/physiomins/acti-sommeil-345.jpg",
    content: `Le bien-être au quotidien tient souvent à quelques habitudes simples, plus qu'à de grands changements. Voici trois réflexes faciles à intégrer.

D'abord, l'hydratation : elle est souvent négligée alors qu'elle influence directement l'énergie et la concentration dans la journée. Garder une bouteille d'eau à portée de main reste l'un des gestes les plus simples et les plus efficaces.

Ensuite, les collations : privilégier des en-cas riches en protéines plutôt que des produits très sucrés permet d'éviter les coups de fatigue de milieu de journée. Les formats prêts à emporter sont particulièrement pratiques en semaine.

Enfin, le sommeil : une routine du soir régulière, même courte, aide à mieux récupérer. Limiter les écrans avant de dormir et se coucher à heures relativement fixes reste l'un des leviers les plus simples pour améliorer la qualité du sommeil sur la durée.`,
  },
];

async function main() {
  for (const post of POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log("upserted:", post.title);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

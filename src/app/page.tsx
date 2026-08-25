import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-black/10 px-4 py-16 text-center dark:border-white/10">
        <h1 className="text-3xl font-semibold">Senteurs & attentions</h1>
        <p className="mx-auto mt-3 max-w-md text-black/60 dark:text-white/60">
          Bougies, brumes et coffrets gourmands pour parfumer votre intérieur.
        </p>
        <Link
          href="/produits"
          className="mt-6 inline-block rounded-full bg-black px-6 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Voir le catalogue
        </Link>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-10">
        <h2 className="text-lg font-medium">Nouveautés</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                compareAtCents: product.compareAtCents,
                categorySlug: product.category.slug,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

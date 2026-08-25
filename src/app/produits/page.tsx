import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const metadata = {
  title: "Catalogue",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(categorie ? { category: { slug: categorie } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Catalogue</h1>

      <nav className="flex flex-wrap gap-2">
        <Link
          href="/produits"
          className={`rounded-full border px-3 py-1 text-sm ${
            !categorie
              ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
              : "border-black/20 dark:border-white/20"
          }`}
        >
          Tous
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/produits?categorie=${category.slug}`}
            className={`rounded-full border px-3 py-1 text-sm ${
              categorie === category.slug
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-black/20 dark:border-white/20"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      {products.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          Aucun produit dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
      )}
    </div>
  );
}

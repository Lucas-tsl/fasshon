import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const metadata = {
  title: "Catalogue",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; marque?: string }>;
}) {
  const { categorie, marque } = await searchParams;

  const [categories, brands, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(categorie ? { category: { slug: categorie } } : {}),
        ...(marque ? { brand: { slug: marque } } : {}),
      },
      include: { category: true, brand: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const buildHref = (next: { categorie?: string; marque?: string }) => {
    const params = new URLSearchParams();
    if (next.categorie) params.set("categorie", next.categorie);
    if (next.marque) params.set("marque", next.marque);
    const qs = params.toString();
    return qs ? `/produits?${qs}` : "/produits";
  };

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm ${
      active ? "border-accent bg-accent text-accent-foreground" : "border-border"
    }`;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Catalogue</h1>

      <div className="flex flex-col gap-2">
        <nav className="flex flex-wrap gap-2">
          <Link href={buildHref({ marque })} className={pill(!categorie)}>
            Toutes les catégories
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildHref({ categorie: category.slug, marque })}
              className={pill(categorie === category.slug)}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-wrap gap-2">
          <Link href={buildHref({ categorie })} className={pill(!marque)}>
            Toutes les marques
          </Link>
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={buildHref({ categorie, marque: brand.slug })}
              className={pill(marque === brand.slug)}
            >
              {brand.name}
            </Link>
          ))}
        </nav>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Aucun produit ne correspond à ce filtre pour le moment.
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
                brandName: product.brand.name,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

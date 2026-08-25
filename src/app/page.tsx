import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true, brand: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Fasshon</h1>
        <p className="mx-auto mt-3 max-w-md text-foreground/60">
          Un concept store qui réunit une sélection de marques françaises — beauté,
          soins naturels, bien-être et senteurs.
        </p>
        <Link
          href="/produits"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-2 text-sm font-medium text-accent-foreground"
        >
          Voir le catalogue
        </Link>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/50">
          Nos marques
        </h2>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/produits?marque=${brand.slug}`}
              className="rounded-full border border-border px-3 py-1 text-sm hover:border-accent"
            >
              {brand.name}
            </Link>
          ))}
        </div>
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
                brandName: product.brand.name,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

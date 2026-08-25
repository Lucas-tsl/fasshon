import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { toCardProduct, groupByType } from "@/lib/product-display";

export default async function MarquePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: { category: true, brand: true, variants: { where: { active: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!brand) notFound();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <div>
        <Link href="/marques" className="text-sm text-foreground/60 hover:underline">
          ← Toutes les marques
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{brand.name}</h1>
        {brand.description ? (
          <p className="mt-2 max-w-xl text-sm text-foreground/60">{brand.description}</p>
        ) : null}
      </div>

      {brand.products.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Aucun produit disponible pour cette marque pour le moment.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {groupByType(brand.products.map(toCardProduct)).map((group) => (
            <section key={group.type} className="flex flex-col gap-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/50">
                {group.type}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {group.products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

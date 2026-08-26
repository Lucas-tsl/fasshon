import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Nos marques",
  description: "Découvrez les marques françaises indépendantes réunies sur Fasshon : beauté, soins et bien-être.",
  alternates: { canonical: "/marques" },
};

export default async function MarquesPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <div>
        <h1 className="font-display text-3xl">Nos marques</h1>
        <p className="mt-2 max-w-xl text-sm text-foreground/60">
          Une sélection de marques françaises indépendantes, réunies dans un seul concept
          store.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/marques/${brand.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-border p-6 transition hover:border-accent hover:shadow-lg hover:shadow-black/5"
          >
            <BrandLogo name={brand.name} logoPath={brand.logoPath} className="h-9" />
            <p className="text-sm text-foreground/60">{brand.description}</p>
            <span className="text-xs uppercase tracking-wide text-foreground/40">
              {brand._count.products} produit{brand._count.products > 1 ? "s" : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

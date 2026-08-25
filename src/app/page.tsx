import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { toCardProduct } from "@/lib/product-display";

export default async function Home() {
  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true, brand: true, variants: { where: { active: true } } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-border px-4 py-20 text-center sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent)",
          }}
        />
        <h1 className="animate-fade-in-up text-4xl font-semibold tracking-tight sm:text-5xl">
          Fasshon
        </h1>
        <p className="animate-fade-in-up stagger-1 mx-auto mt-4 max-w-md text-foreground/60">
          Un concept store qui réunit une sélection de marques françaises — beauté,
          soins naturels, bien-être et senteurs.
        </p>
        <Link
          href="/produits"
          className="animate-fade-in-up stagger-2 mt-8 inline-block rounded-full bg-accent px-7 py-2.5 text-sm font-medium text-accent-foreground transition-transform duration-200 hover:scale-105 hover:opacity-90"
        >
          Voir le catalogue
        </Link>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/50">
          Nos marques
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brands.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/marques/${brand.slug}`}
              className="animate-fade-in-up group rounded-xl border border-border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-black/5"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-sm font-medium transition-colors group-hover:text-accent">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-10">
        <h2 className="text-lg font-medium">Nouveautés</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <ProductCard product={toCardProduct(product)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

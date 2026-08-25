import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { toCardProduct } from "@/lib/product-display";
import { BrandLogo } from "@/components/BrandLogo";
import { Carousel, CarouselItem } from "@/components/Carousel";
import { TrustBadges } from "@/components/TrustBadges";
import { PRODUCT_TYPE_ORDER } from "@/lib/product-type";

const TYPE_EMOJI: Record<string, string> = {
  Parfums: "🌸",
  "Coffrets & Sets cadeaux": "🎁",
  "Brumes & Eaux parfumées": "💨",
  "Palettes & Maquillage yeux": "💄",
  Teint: "✨",
  "Sérums, crèmes & soins visage": "🧴",
  "Compléments & Bien-être": "🌿",
  "Plats & Repas protéinés": "🍲",
  "Desserts & Douceurs": "🍪",
  "Minceur & Drainage": "💧",
  "Accessoires & Divers": "👜",
};

export default async function Home() {
  const [products, brands, typeCounts] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true, brand: true, variants: { where: { active: true } } },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.groupBy({
      by: ["productType"],
      where: { active: true, productType: { not: null } },
      _count: true,
    }),
  ]);

  const topTypes = typeCounts
    .filter((t) => t.productType)
    .sort((a, b) => {
      const ia = PRODUCT_TYPE_ORDER.indexOf(a.productType!);
      const ib = PRODUCT_TYPE_ORDER.indexOf(b.productType!);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    })
    .slice(0, 8);

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
        <div className="animate-fade-in-up stagger-2 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/produits"
            className="inline-block rounded-full bg-accent px-7 py-2.5 text-sm font-medium text-accent-foreground transition-transform duration-200 hover:scale-105 hover:opacity-90"
          >
            Voir le catalogue
          </Link>
          <Link
            href="/marques"
            className="inline-block rounded-full border border-border px-7 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Découvrir nos marques
          </Link>
        </div>
      </section>

      <section className="border-b border-border px-4 py-8">
        <TrustBadges className="mx-auto max-w-5xl" />
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-10">
        <h2 className="text-lg font-medium">Parcourir par catégorie</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {topTypes.map((t, i) => (
            <Link
              key={t.productType}
              href={`/produits?type=${encodeURIComponent(t.productType!)}`}
              className="animate-fade-in-up group flex flex-col items-center justify-center gap-2 rounded-xl border border-border px-3 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-black/5"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <span className="text-2xl" aria-hidden="true">
                {TYPE_EMOJI[t.productType!] ?? "🛍️"}
              </span>
              <span className="text-sm font-medium transition-colors group-hover:text-accent">
                {t.productType}
              </span>
              <span className="text-xs text-foreground/40">{t._count} produits</span>
            </Link>
          ))}
        </div>
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
              className="animate-fade-in-up group flex items-center justify-center rounded-xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-black/5"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <BrandLogo name={brand.name} logoPath={brand.logoPath} className="h-8" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-10">
        <h2 className="text-lg font-medium">Nouveautés</h2>
        <Carousel>
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <ProductCard product={toCardProduct(product)} />
            </CarouselItem>
          ))}
        </Carousel>
      </section>
    </div>
  );
}

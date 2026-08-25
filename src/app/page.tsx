import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { toCardProduct } from "@/lib/product-display";
import { BrandLogo } from "@/components/BrandLogo";
import { Carousel, CarouselItem } from "@/components/Carousel";
import { BrandShowcaseBanner } from "@/components/BrandShowcaseBanner";
import { parseImages } from "@/lib/product-display";
import { PRODUCT_TYPE_ORDER } from "@/lib/product-type";
import { getWishlistedProductIds } from "@/lib/wishlist";

const SHOWCASE_TYPE_BY_BRAND: Record<string, string> = {
  "jozz-beauty": "Palettes & Maquillage yeux",
  "les-senteurs-gourmandes": "Parfums",
  "pur-eden": "Sérums, crèmes & soins visage",
  physiomins: "Compléments & Bien-être",
};

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
  const [brands, typeCounts, wishlistedIds] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.groupBy({
      by: ["productType"],
      where: { active: true, productType: { not: null } },
      _count: true,
    }),
    getWishlistedProductIds(),
  ]);

  // Autant de produits que possible par marque plutôt qu'un simple "plus
  // récents" global : sinon la marque importée en dernier (même de longue
  // date en réalité) écrase les 3 autres dans "Nouveautés".
  const perBrandProducts = await Promise.all(
    brands.map((brand) =>
      prisma.product.findMany({
        where: { active: true, brandId: brand.id },
        include: {
          category: true,
          brand: true,
          variants: { where: { active: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ),
  );
  const products = perBrandProducts.flatMap((list, i) =>
    list.map((product, j) => ({ product, order: j * brands.length + i })),
  )
    .sort((a, b) => a.order - b.order)
    .map((x) => x.product);

  const showcasePicks = await Promise.all(
    brands.map(async (brand) => {
      const preferredType = SHOWCASE_TYPE_BY_BRAND[brand.slug];
      const product =
        (preferredType &&
          (await prisma.product.findFirst({
            where: { brandId: brand.id, productType: preferredType, active: true, NOT: { images: "[]" } },
            orderBy: { priceCents: "desc" },
          }))) ||
        (await prisma.product.findFirst({
          where: { brandId: brand.id, active: true, NOT: { images: "[]" } },
          orderBy: { priceCents: "desc" },
        }));
      if (!product) return null;
      return {
        brandSlug: brand.slug,
        brandName: brand.name,
        image: parseImages(product.images)[0]!,
        productName: product.name,
      };
    }),
  );
  const showcaseTiles = showcasePicks.filter((t): t is NonNullable<typeof t> => t !== null);

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
      <section className="relative overflow-hidden bg-surface-inverse px-4 py-24 text-center text-foreground-inverse sm:py-32">
        <h1 className="font-display animate-fade-in-up text-6xl leading-[0.95] sm:text-8xl">
          Beauté.
          <br />
          Soins.
          <br />
          <span className="text-accent">Bien-être.</span>
        </h1>
        <p className="animate-fade-in-up stagger-1 mx-auto mt-6 max-w-md text-foreground-inverse/70">
          Un concept store qui réunit une sélection de marques françaises indépendantes.
        </p>
        <div className="animate-fade-in-up stagger-2 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/produits" className="btn-primary">
            Voir le catalogue
          </Link>
          <Link
            href="/marques"
            className="inline-flex items-center justify-center gap-2 rounded-md border-[1.5px] border-foreground-inverse px-7 py-3 text-[13px] font-semibold tracking-wide text-foreground-inverse uppercase transition-colors hover:bg-foreground-inverse hover:text-surface-inverse"
          >
            Découvrir nos marques
          </Link>
        </div>
      </section>

      <BrandShowcaseBanner tiles={showcaseTiles} />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12">
        <h2 className="font-display text-2xl">Parcourir par catégorie</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {topTypes.map((t, i) => (
            <Link
              key={t.productType}
              href={`/produits?type=${encodeURIComponent(t.productType!)}`}
              className="animate-fade-in-up group flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-muted px-3 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-surface-inverse"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <span className="text-2xl" aria-hidden="true">
                {TYPE_EMOJI[t.productType!] ?? "🛍️"}
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase transition-colors group-hover:text-foreground-inverse">
                {t.productType}
              </span>
              <span className="text-xs text-foreground/40 transition-colors group-hover:text-foreground-inverse/50">
                {t._count} produits
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-12">
        <h2 className="text-xs font-semibold tracking-widest text-foreground/50 uppercase">
          Nos marques
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brands.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/marques/${brand.slug}`}
              className="animate-fade-in-up group flex items-center justify-center rounded-md border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <BrandLogo name={brand.name} logoPath={brand.logoPath} className="h-8" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12">
        <h2 className="font-display text-2xl">Nouveautés</h2>
        <Carousel>
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <ProductCard product={toCardProduct(product)} wishlisted={wishlistedIds.has(product.id)} />
            </CarouselItem>
          ))}
        </Carousel>
      </section>
    </div>
  );
}

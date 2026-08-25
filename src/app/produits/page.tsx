import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { toCardProduct, groupByType } from "@/lib/product-display";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PRODUCT_TYPE_ORDER } from "@/lib/product-type";
import { getWishlistedProductIds } from "@/lib/wishlist";

export const metadata = {
  title: "Catalogue",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; marque?: string; type?: string }>;
}) {
  const { categorie, marque, type } = await searchParams;

  const [categories, brands, matchingProducts, wishlistedIds] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(categorie ? { category: { slug: categorie } } : {}),
        ...(marque ? { brand: { slug: marque } } : {}),
      },
      include: { category: true, brand: true, variants: { where: { active: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getWishlistedProductIds(),
  ]);

  const cardProducts = matchingProducts.map(toCardProduct);
  const availableTypes = PRODUCT_TYPE_ORDER.filter((t) =>
    cardProducts.some((p) => p.productType === t),
  );
  const products = type ? cardProducts.filter((p) => p.productType === type) : cardProducts;

  const buildHref = (next: { categorie?: string; marque?: string; type?: string }) => {
    const params = new URLSearchParams();
    if (next.categorie) params.set("categorie", next.categorie);
    if (next.marque) params.set("marque", next.marque);
    if (next.type) params.set("type", next.type);
    const qs = params.toString();
    return qs ? `/produits?${qs}` : "/produits";
  };

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      active ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"
    }`;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "Catalogue" }]} />
      <h1 className="font-display text-3xl">Catalogue</h1>

      <div className="flex flex-col gap-2">
        <nav className="flex flex-wrap gap-2">
          <Link href={buildHref({ marque, type })} className={pill(!categorie)}>
            Toutes les catégories
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildHref({ categorie: category.slug, marque, type })}
              className={pill(categorie === category.slug)}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-wrap gap-2">
          <Link href={buildHref({ categorie, type })} className={pill(!marque)}>
            Toutes les marques
          </Link>
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={buildHref({ categorie, marque: brand.slug, type })}
              className={pill(marque === brand.slug)}
            >
              {brand.name}
            </Link>
          ))}
        </nav>

        {availableTypes.length > 1 ? (
          <nav className="flex flex-wrap gap-2">
            <Link href={buildHref({ categorie, marque })} className={pill(!type)}>
              Tous les types
            </Link>
            {availableTypes.map((t) => (
              <Link
                key={t}
                href={buildHref({ categorie, marque, type: t })}
                className={pill(type === t)}
              >
                {t}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Aucun produit ne correspond à ce filtre pour le moment.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {groupByType(products).map((group) => (
            <section key={group.type} className="flex flex-col gap-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/50">
                {group.type}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {group.products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    wishlisted={wishlistedIds.has(product.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { toCardProduct, groupByType } from "@/lib/product-display";
import { BrandLogo } from "@/components/BrandLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getWishlistedProductIds } from "@/lib/wishlist";
import { BrandSocialLinks } from "@/components/BrandSocialLinks";
import { TypeQuickNav } from "@/components/TypeQuickNav";
import { slugifyType } from "@/lib/product-type";

export default async function MarquePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [brand, wishlistedIds] = await Promise.all([
    prisma.brand.findUnique({
      where: { slug },
      include: {
        products: {
          where: { active: true },
          include: {
            category: true,
            brand: true,
            variants: { where: { active: true } },
            reviews: { select: { rating: true } },
          },
          orderBy: { name: "asc" },
        },
      },
    }),
    getWishlistedProductIds(),
  ]);

  if (!brand) notFound();

  const groups = groupByType(brand.products.map(toCardProduct));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 pb-28">
      <div className="flex flex-col gap-4">
        <Breadcrumb items={[{ label: "Marques", href: "/marques" }, { label: brand.name }]} />
        <BrandLogo name={brand.name} logoPath={brand.logoPath} className="h-10" />
        {brand.description ? (
          <p className="max-w-xl text-sm text-foreground/60">{brand.description}</p>
        ) : null}
        <BrandSocialLinks
          youtubeUrl={brand.youtubeUrl}
          tiktokUrl={brand.tiktokUrl}
          instagramUrl={brand.instagramUrl}
        />
      </div>

      {brand.products.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Aucun produit disponible pour cette marque pour le moment.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.type} id={`type-${slugifyType(group.type)}`} className="flex scroll-mt-24 flex-col gap-4">
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

      <TypeQuickNav types={groups.map((g) => g.type)} />
    </div>
  );
}

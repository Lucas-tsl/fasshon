import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { ProductGallery } from "@/components/ProductGallery";
import { parseImages } from "@/lib/product-display";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      variants: { where: { active: true }, orderBy: { position: "asc" } },
    },
  });

  if (!product || !product.active) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Catalogue", href: "/produits" },
          { label: product.brand.name, href: `/marques/${product.brand.slug}` },
          { label: product.name },
        ]}
      />

      <ProductGallery
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          priceCents: product.priceCents,
          stock: product.stock,
          brandName: product.brand.name,
          categorySlug: product.category.slug,
          image: parseImages(product.images)[0] ?? null,
        }}
        variants={product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          priceCents: v.priceCents,
          stock: v.stock,
          image: v.image,
        }))}
      />

      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <div>
          <Link
            href={`/produits?categorie=${product.category.slug}`}
            className="text-sm text-foreground/60 hover:underline"
          >
            {product.category.name}
          </Link>
          <h1 className="font-display text-3xl">{product.name}</h1>
        </div>

        {product.variants.length === 0 && product.compareAtCents ? (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{formatPrice(product.priceCents)}</span>
            <span className="text-foreground/40 line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          </div>
        ) : null}

        <p className="max-w-2xl text-sm leading-relaxed text-foreground/70">
          {product.description}
        </p>

        <p className="text-xs text-foreground/50">SKU : {product.sku}</p>
      </div>
    </div>
  );
}

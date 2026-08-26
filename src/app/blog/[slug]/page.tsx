import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BlogImage } from "@/components/BlogImage";
import { ProductCard } from "@/components/ProductCard";
import { toCardProduct } from "@/lib/product-display";
import { getWishlistedProductIds } from "@/lib/wishlist";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });
  if (!post) return { title: "Article introuvable" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, wishlistedIds] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { slug },
      include: {
        relatedProducts: {
          where: { active: true },
          include: {
            category: true,
            brand: true,
            variants: { where: { active: true } },
            reviews: { select: { rating: true } },
          },
        },
      },
    }),
    getWishlistedProductIds(),
  ]);
  if (!post || !post.published) {
    notFound();
  }

  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <BlogImage src={post.coverImage} title={post.title} className="aspect-[16/9] w-full" sizes="(min-width: 768px) 672px, 100vw" />

      <div>
        <p className="text-xs text-foreground/50">
          {post.publishedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="font-display text-3xl">{post.title}</h1>
      </div>

      <div className="flex flex-col gap-4 text-sm leading-relaxed text-foreground/80">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {post.relatedProducts.length > 0 ? (
        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <h2 className="font-display text-2xl">Produits associés</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {post.relatedProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={toCardProduct(product)}
                wishlisted={wishlistedIds.has(product.id)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BlogImage } from "@/components/BlogImage";

export const metadata = {
  title: "Blog",
  description: "Conseils beauté, soins et bien-être par Fasshon, concept store multi-marques français.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "Blog" }]} />
      <h1 className="font-display text-3xl">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-sm text-foreground/60">Aucun article pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 rounded-md border border-border p-3 ring-1 ring-transparent transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:ring-foreground"
            >
              <BlogImage src={post.coverImage} title={post.title} className="aspect-[4/3] w-full" />
              <div>
                <p className="text-xs text-foreground/50">
                  {post.publishedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h2 className="font-display text-lg">{post.title}</h2>
                <p className="mt-1 text-sm text-foreground/60">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

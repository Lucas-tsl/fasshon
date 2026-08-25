import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BlogImage } from "@/components/BlogImage";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({ where: { slug } });
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
    </div>
  );
}

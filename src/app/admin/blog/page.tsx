import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/AdminNav";
import { createPost, updatePost, deletePost } from "./actions";

export default async function AdminBlogPage() {
  const [posts, products] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      include: { relatedProducts: { select: { id: true } } },
    }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <AdminNav />
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-10">
        <div>
          <h1 className="text-2xl font-semibold">Articles de blog</h1>
          <div className="mt-4 flex flex-col gap-6">
            {posts.map((post) => (
              <form
                key={post.id}
                action={updatePost}
                className="flex flex-col gap-2 rounded-xl border border-border p-4"
              >
                <input type="hidden" name="id" value={post.id} />
                <input
                  name="title"
                  defaultValue={post.title}
                  required
                  className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-medium"
                />
                <input
                  name="coverImage"
                  defaultValue={post.coverImage ?? ""}
                  placeholder="Chemin de l'image de couverture (ex: /products/...)"
                  className="rounded-lg border border-border bg-transparent px-3 py-2 text-xs"
                />
                <textarea
                  name="excerpt"
                  defaultValue={post.excerpt}
                  required
                  rows={2}
                  placeholder="Résumé"
                  className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
                />
                <textarea
                  name="content"
                  defaultValue={post.content}
                  required
                  rows={6}
                  placeholder="Contenu (séparez les paragraphes par une ligne vide)"
                  className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-xs text-foreground/60">
                  <input type="checkbox" name="published" defaultChecked={post.published} />
                  Publié
                </label>
                <label className="flex flex-col gap-1 text-xs text-foreground/60">
                  Produits associés (Ctrl/Cmd + clic pour en sélectionner plusieurs)
                  <select
                    name="productIds"
                    multiple
                    size={6}
                    defaultValue={post.relatedProducts.map((p) => p.id)}
                    className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="submit"
                    formAction={deletePost}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:border-red-400"
                  >
                    Supprimer
                  </button>
                </div>
              </form>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium">Nouvel article</h2>
          <form action={createPost} className="mt-4 flex flex-col gap-3">
            <input
              name="title"
              placeholder="Titre"
              required
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
            />
            <input
              name="coverImage"
              placeholder="Chemin de l'image de couverture (optionnel)"
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
            />
            <textarea
              name="excerpt"
              placeholder="Résumé"
              required
              rows={2}
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
            />
            <textarea
              name="content"
              placeholder="Contenu (séparez les paragraphes par une ligne vide)"
              required
              rows={6}
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
            />
            <label className="flex flex-col gap-1 text-xs text-foreground/60">
              Produits associés (Ctrl/Cmd + clic pour en sélectionner plusieurs)
              <select
                name="productIds"
                multiple
                size={6}
                className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
            >
              Publier l&apos;article
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

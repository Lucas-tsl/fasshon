import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/AdminNav";
import { updateProduct, createProduct } from "../actions";

export default async function AdminProduitsPage() {
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, brand: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <AdminNav />
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
        <div>
          <h1 className="text-2xl font-semibold">Produits</h1>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-foreground/60">
                  <th className="py-2 pr-3">Produit</th>
                  <th className="py-2 pr-3">Marque</th>
                  <th className="py-2 pr-3">Prix (€)</th>
                  <th className="py-2 pr-3">Stock</th>
                  <th className="py-2 pr-3">Actif</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border">
                    <td className="py-2 pr-3">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-foreground/50">
                        {product.category.name} · {product.sku}
                      </p>
                    </td>
                    <td className="py-2 pr-3">{product.brand.name}</td>
                    <td className="py-2 pr-3">
                      <input
                        form={`product-${product.id}`}
                        type="number"
                        name="price"
                        step="0.01"
                        min="0"
                        defaultValue={(product.priceCents / 100).toFixed(2)}
                        className="w-20 rounded border border-border bg-transparent px-2 py-1"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        form={`product-${product.id}`}
                        type="number"
                        name="stock"
                        min="0"
                        defaultValue={product.stock}
                        className="w-16 rounded border border-border bg-transparent px-2 py-1"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        form={`product-${product.id}`}
                        type="checkbox"
                        name="active"
                        defaultChecked={product.active}
                      />
                    </td>
                    <td className="py-2">
                      <button
                        form={`product-${product.id}`}
                        type="submit"
                        className="rounded-full border border-border px-3 py-1 text-xs hover:border-accent"
                      >
                        Enregistrer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Un <form> par produit, hors du <table> (HTML n'autorise pas de
              <form> comme enfant direct de <tr>) ; les champs s'y rattachent
              via l'attribut form="product-<id>". */}
          {products.map((product) => (
            <form
              key={product.id}
              id={`product-${product.id}`}
              action={updateProduct}
              className="hidden"
            >
              <input type="hidden" name="id" value={product.id} />
            </form>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-medium">Ajouter un produit</h2>
          <form action={createProduct} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              name="name"
              placeholder="Nom du produit"
              required
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm sm:col-span-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              required
              rows={3}
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Prix (€)"
              required
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
            />
            <input
              name="stock"
              type="number"
              min="0"
              placeholder="Stock initial"
              defaultValue={0}
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
            />
            <input
              name="sku"
              placeholder="SKU"
              required
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
            />
            <select
              name="categoryId"
              required
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
            >
              <option value="">Catégorie…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              name="brandId"
              required
              className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm sm:col-span-2"
            >
              <option value="">Marque…</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground sm:col-span-2"
            >
              Créer le produit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

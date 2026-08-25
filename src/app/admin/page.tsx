import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { AdminNav } from "@/components/AdminNav";
import { markOrderFulfilled } from "./actions";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée — à traiter",
  FULFILLED: "Traitée",
  CANCELED: "Annulée",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminNav />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <h1 className="text-2xl font-semibold">Commandes</h1>

        {orders.length === 0 ? (
          <p className="text-sm text-foreground/60">Aucune commande pour le moment.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      Commande n° {order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {order.email} · {order.createdAt.toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-border px-2 py-1 text-xs">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="font-semibold">{formatPrice(order.totalCents)}</span>
                  </div>
                </div>

                <ul className="mt-3 flex flex-col gap-1 text-sm text-foreground/70">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity} × {item.nameSnap} — {formatPrice(item.priceCents * item.quantity)}
                    </li>
                  ))}
                </ul>

                {order.status === "PAID" ? (
                  <form action={markOrderFulfilled.bind(null, order.id)} className="mt-3">
                    <button
                      type="submit"
                      className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground"
                    >
                      Marquer comme traitée (commande passée au fournisseur)
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

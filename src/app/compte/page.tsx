import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/user-auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Breadcrumb } from "@/components/Breadcrumb";
import { logout, changePassword } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  FULFILLED: "Expédiée",
  CANCELED: "Annulée",
};

const PASSWORD_ERRORS: Record<string, string> = {
  "current-password": "Mot de passe actuel incorrect.",
  "new-password": "Le nouveau mot de passe doit contenir au moins 8 caractères.",
};

export const metadata = { title: "Mon compte" };

export default async function ComptePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; passwordChanged?: string }>;
}) {
  const { error, passwordChanged } = await searchParams;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/compte/connexion");
  }

  // Rattache aussi les commandes passées en invité avec la même adresse
  // email avant la création du compte.
  const orders = await prisma.order.findMany({
    where: { OR: [{ userId: user.id }, { email: user.email }] },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <Breadcrumb items={[{ label: "Mon compte" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Mon compte</h1>
          <p className="text-sm text-foreground/60">
            {user.name ? `${user.name} — ` : ""}
            {user.email}
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-foreground/60 hover:text-foreground">
            Se déconnecter
          </button>
        </form>
      </div>

      <Link
        href="/compte/liste-de-souhaits"
        className="w-fit rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground"
      >
        ♥ Ma liste de souhaits
      </Link>

      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold tracking-widest text-foreground/50 uppercase">
          Mes commandes
        </h2>
        {orders.length === 0 ? (
          <p className="text-sm text-foreground/60">
            Vous n&apos;avez pas encore passé de commande.{" "}
            <Link href="/produits" className="text-accent hover:underline">
              Voir le catalogue
            </Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {orders.map((order) => (
              <li key={order.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    Commande n°{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-foreground/50">
                    {order.createdAt.toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-foreground/50">
                  {STATUS_LABEL[order.status] ?? order.status} — {order.items.length} article
                  {order.items.length > 1 ? "s" : ""} — {formatPrice(order.totalCents)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold tracking-widest text-foreground/50 uppercase">
          Mot de passe
        </h2>
        {passwordChanged ? (
          <p className="text-sm text-green-700">Mot de passe mis à jour.</p>
        ) : null}
        {error && PASSWORD_ERRORS[error] ? (
          <p className="text-sm text-red-600">{PASSWORD_ERRORS[error]}</p>
        ) : null}
        <form action={changePassword} className="flex max-w-sm flex-col gap-3">
          <input
            type="password"
            name="currentPassword"
            placeholder="Mot de passe actuel"
            required
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Nouveau mot de passe (8 caractères minimum)"
            required
            minLength={8}
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
          <button type="submit" className="btn-secondary w-fit">
            Changer mon mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}

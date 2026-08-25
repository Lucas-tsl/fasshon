import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { recordOrderFromCheckoutSession } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export default async function CommandeSuccesPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Session de paiement introuvable.</h1>
        <Link href="/produits" className="mt-4 inline-block text-accent hover:underline">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== "paid") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Le paiement n&apos;a pas abouti.</h1>
        <Link href="/panier" className="mt-4 inline-block text-accent hover:underline">
          Retour au panier
        </Link>
      </div>
    );
  }

  const order = await recordOrderFromCheckoutSession(session);

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <ClearCartOnMount />
      <div className="text-center">
        <span className="text-4xl" aria-hidden="true">
          🎉
        </span>
        <h1 className="mt-3 text-2xl font-semibold">Merci pour votre commande !</h1>
        <p className="mt-2 text-foreground/70">
          Un e-mail de confirmation a été envoyé à {session.customer_details?.email}.
        </p>
      </div>

      {order ? (
        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Commande n° {order.id.slice(-8).toUpperCase()}</span>
            <span className="text-foreground/60">
              {order.createdAt.toLocaleDateString("fr-FR")}
            </span>
          </div>

          <ul className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span className="text-foreground/70">
                  {item.quantity} × {item.nameSnap}
                  {item.variantNameSnap ? ` (${item.variantNameSnap})` : ""}
                </span>
                <span className="font-medium">{formatPrice(item.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.totalCents)}</span>
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-center text-xs text-foreground/50">
        Votre commande est transmise à notre équipe pour préparation. Vous recevrez un
        suivi dès son expédition.
      </p>

      <div className="mt-6 text-center">
        <Link href="/produits" className="text-accent hover:underline">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}

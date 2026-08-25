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
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <ClearCartOnMount />
      <h1 className="text-2xl font-semibold">Merci pour votre commande !</h1>
      <p className="mt-2 text-foreground/70">
        Un e-mail de confirmation a été envoyé à {session.customer_details?.email}.
      </p>
      {order ? (
        <p className="mt-4 text-sm text-foreground/60">
          Commande n° {order.id.slice(-8).toUpperCase()} — {formatPrice(order.totalCents)}
        </p>
      ) : null}
      <Link href="/produits" className="mt-6 inline-block text-accent hover:underline">
        Continuer mes achats
      </Link>
    </div>
  );
}

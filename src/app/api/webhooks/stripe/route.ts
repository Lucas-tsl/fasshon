import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { recordOrderFromCheckoutSession } from "@/lib/orders";

// Filet de sécurité pour la production : le webhook Stripe confirme la
// commande même si le client ferme l'onglet avant la redirection vers
// /commande/succes. Nécessite STRIPE_WEBHOOK_SECRET (voir Stripe Dashboard
// > Developers > Webhooks, endpoint /api/webhooks/stripe).
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(payload, signature ?? "", webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await recordOrderFromCheckoutSession(event.data.object);
  }

  return NextResponse.json({ received: true });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/user-auth";

type CartInput = { productId: string; variantId: string | null; quantity: number };

export async function POST(request: NextRequest) {
  let body: { items?: CartInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items = rawItems.filter(
    (i): i is CartInput =>
      typeof i?.productId === "string" &&
      (i.variantId === null || typeof i.variantId === "string") &&
      Number.isInteger(i?.quantity) &&
      i.quantity > 0 &&
      i.quantity <= 20,
  );

  if (items.length === 0) {
    return NextResponse.json({ error: "Panier vide." }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, active: true },
    include: { variants: true },
  });

  const lineItems: Array<{
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string };
    };
    quantity: number;
  }> = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json(
        { error: "Un des produits du panier n'existe plus." },
        { status: 400 },
      );
    }

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId && v.active);
      if (!variant) {
        return NextResponse.json(
          { error: `Variante indisponible pour "${product.name}".` },
          { status: 400 },
        );
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour "${product.name} — ${variant.name}".` },
          { status: 400 },
        );
      }
      lineItems.push({
        price_data: {
          currency: "eur",
          unit_amount: variant.priceCents,
          product_data: { name: `${product.name} — ${variant.name}` },
        },
        quantity: item.quantity,
      });
    } else {
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour "${product.name}".` },
          { status: 400 },
        );
      }
      lineItems.push({
        price_data: {
          currency: "eur",
          unit_amount: product.priceCents,
          product_data: { name: product.name },
        },
        quantity: item.quantity,
      });
    }
  }

  const cartMeta = JSON.stringify(
    items.map((i) => ({ p: i.productId, v: i.variantId, q: i.quantity })),
  );
  if (cartMeta.length > 480) {
    return NextResponse.json(
      { error: "Panier trop volumineux, réduisez le nombre d'articles." },
      { status: 400 },
    );
  }

  const user = await getCurrentUser();

  let session;
  try {
    const stripe = getStripe();
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${request.nextUrl.origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/panier`,
      customer_email: user?.email,
      metadata: { cart: cartMeta, userId: user?.id ?? "" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur Stripe.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}

import type Stripe from "stripe";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import { formatPrice } from "@/lib/format";

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

type CartMetaEntry = { p: string; v: string | null; q: number };

/**
 * Idempotent: safe to call multiple times for the same Checkout Session
 * (e.g. once from the success page redirect, once from a Stripe webhook).
 */
export async function recordOrderFromCheckoutSession(session: Stripe.Checkout.Session) {
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
    include: { items: true },
  });
  if (existing) return existing;

  if (session.payment_status !== "paid") return null;

  let cart: CartMetaEntry[] = [];
  try {
    cart = JSON.parse(session.metadata?.cart ?? "[]");
  } catch {
    cart = [];
  }
  if (cart.length === 0) return null;

  const products = await prisma.product.findMany({
    where: { id: { in: cart.map((c) => c.p) } },
    include: { variants: true },
  });

  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        stripeSessionId: session.id,
        email: session.customer_details?.email ?? session.customer_email ?? "inconnu",
        status: "PAID",
        totalCents: session.amount_total ?? 0,
        userId: session.metadata?.userId || null,
        items: {
          create: cart
            .map((entry) => {
              const product = products.find((p) => p.id === entry.p);
              if (!product) return null;
              const variant = entry.v ? product.variants.find((v) => v.id === entry.v) : null;
              return {
                productId: product.id,
                variantId: variant?.id ?? null,
                nameSnap: product.name,
                variantNameSnap: variant?.name ?? null,
                priceCents: variant?.priceCents ?? product.priceCents,
                quantity: entry.q,
              };
            })
            .filter((x): x is NonNullable<typeof x> => x !== null),
        },
      },
      include: { items: true },
    });

    for (const entry of cart) {
      if (entry.v) {
        await tx.productVariant.updateMany({
          where: { id: entry.v },
          data: { stock: { decrement: entry.q } },
        });
      } else {
        await tx.product.updateMany({
          where: { id: entry.p },
          data: { stock: { decrement: entry.q } },
        });
      }
    }

    return order;
  });

  await sendOrderConfirmationEmail(order);

  return order;
}

async function sendOrderConfirmationEmail(order: OrderWithItems | null) {
  if (!order || order.email === "inconnu") return;
  const resend = getResend();
  if (!resend) return;

  const lines = order.items
    .map(
      (item) =>
        `${item.quantity} × ${item.nameSnap}${item.variantNameSnap ? ` (${item.variantNameSnap})` : ""} — ${formatPrice(item.priceCents * item.quantity)}`,
    )
    .join("\n");

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: order.email,
      subject: `Confirmation de votre commande n°${order.id.slice(-8).toUpperCase()}`,
      text: `Merci pour votre commande !\n\n${lines}\n\nTotal : ${formatPrice(order.totalCents)}\n\nNous la préparons dès que possible.`,
    });
  } catch {
    // La commande reste valide même si l'email échoue.
  }
}

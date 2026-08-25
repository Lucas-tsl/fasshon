import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY manquante. Ajoutez votre clé secrète Stripe (mode test) dans .env.",
    );
  }
  if (!cached) {
    cached = new Stripe(key);
  }
  return cached;
}

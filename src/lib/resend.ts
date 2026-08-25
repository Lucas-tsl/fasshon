import { Resend } from "resend";

let cached: Resend | null = null;

/** Retourne null (plutôt que de lever) quand la clé n'est pas configurée :
 * les emails sont alors silencieusement sautés au lieu de faire échouer
 * l'action (inscription newsletter, confirmation de commande...). */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? "Fasshon <onboarding@resend.dev>";

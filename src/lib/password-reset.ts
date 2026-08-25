import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { getResend, EMAIL_FROM } from "@/lib/resend";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  return token;
}

export async function consumePasswordResetToken(token: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.user;
}

export async function sendPasswordResetEmail(email: string, token: string, origin: string) {
  const resend = getResend();
  const resetUrl = `${origin}/compte/reinitialiser?token=${token}`;
  if (!resend) {
    // Pas de clé Resend configurée (dev local) : le lien reste consultable
    // dans les logs serveur pour pouvoir tester le flux quand même.
    console.log(`[reset password] Lien pour ${email} : ${resetUrl}`);
    return;
  }
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Réinitialisation de votre mot de passe Fasshon",
      text: `Vous avez demandé à réinitialiser votre mot de passe.\n\nCliquez sur ce lien (valable 1h) : ${resetUrl}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.`,
    });
  } catch {
    // Le flux reste silencieux pour ne pas révéler si l'email existe.
  }
}

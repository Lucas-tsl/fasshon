import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResend, EMAIL_FROM } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const resend = getResend();
  if (resend) {
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: "Bienvenue chez Fasshon",
        text: "Merci de votre inscription à la newsletter Fasshon ! Vous serez informé·e en avant-première de nos nouveautés.",
      });
    } catch {
      // L'inscription reste valide même si l'email de bienvenue échoue.
    }
  }

  return NextResponse.json({ ok: true });
}

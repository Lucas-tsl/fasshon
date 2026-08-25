"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPasswordHash, setUserSession, clearUserSession } from "@/lib/user-auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    redirect("/compte/inscription?error=email");
  }
  if (password.length < 8) {
    redirect("/compte/inscription?error=password");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/compte/inscription?error=exists");
  }

  const user = await prisma.user.create({
    data: { email, passwordHash: hashPassword(password), name: name || null },
  });

  await setUserSession(user.id);
  redirect("/compte");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPasswordHash(password, user.passwordHash)) {
    redirect("/compte/connexion?error=1");
  }

  await setUserSession(user.id);
  redirect("/compte");
}

export async function logout() {
  await clearUserSession();
  redirect("/");
}

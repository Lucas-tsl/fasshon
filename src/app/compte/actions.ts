"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPasswordHash,
  setUserSession,
  clearUserSession,
  requireUser,
} from "@/lib/user-auth";
import {
  createPasswordResetToken,
  consumePasswordResetToken,
  sendPasswordResetEmail,
} from "@/lib/password-reset";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function currentOrigin(): Promise<string> {
  const store = await headers();
  const proto = store.get("x-forwarded-proto") ?? "http";
  const host = store.get("host");
  return `${proto}://${host}`;
}

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

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Toujours le même message, que le compte existe ou non, pour ne pas
  // révéler quels emails sont enregistrés.
  if (user) {
    const token = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail(user.email, token, await currentOrigin());
  }

  redirect("/compte/mot-de-passe-oublie?sent=1");
}

export async function resetPassword(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    redirect(`/compte/reinitialiser?token=${token}&error=password`);
  }

  const user = await consumePasswordResetToken(token);
  if (!user) {
    redirect("/compte/reinitialiser?error=invalid");
  }

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(password) } });
  await setUserSession(user.id);
  redirect("/compte");
}

export async function changePassword(formData: FormData) {
  const user = await requireUser();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!verifyPasswordHash(currentPassword, user.passwordHash)) {
    redirect("/compte?error=current-password");
  }
  if (newPassword.length < 8) {
    redirect("/compte?error=new-password");
  }

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(newPassword) } });
  redirect("/compte?passwordChanged=1");
}

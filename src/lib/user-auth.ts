import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const USER_COOKIE_NAME = "user_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET manquant dans .env");
  return secret;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, derived] = stored.split(":");
  if (!salt || !derived) return false;
  const candidate = scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(candidate);
  const b = Buffer.from(derived);
  return a.length === b.length && timingSafeEqual(a, b);
}

function signUserId(userId: string): string {
  return createHmac("sha256", getSecret()).update(userId).digest("hex");
}

async function setUserSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(USER_COOKIE_NAME, `${userId}.${signUserId(userId)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export { setUserSession };

export async function clearUserSession(): Promise<void> {
  const store = await cookies();
  store.delete(USER_COOKIE_NAME);
}

async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(USER_COOKIE_NAME)?.value;
  if (!value) return null;
  const [userId, signature] = value.split(".");
  if (!userId || !signature) return null;
  const expected = signUserId(userId);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return userId;
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Non autorisé");
  return user;
}

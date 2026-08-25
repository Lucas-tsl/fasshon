import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { USER_COOKIE_NAME } from "@/lib/user-auth";

function isValidAdminSession(cookieValue: string | undefined): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!cookieValue || !secret) return false;
  const expected = createHmac("sha256", secret).update("admin-authenticated").digest("hex");
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function isValidUserSession(cookieValue: string | undefined): boolean {
  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_SESSION_SECRET;
  if (!cookieValue || !secret) return false;
  const [userId, signature] = cookieValue.split(".");
  if (!userId || !signature) return false;
  const expected = createHmac("sha256", secret).update(userId).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const authenticated = isValidAdminSession(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
    if (!authenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/compte")) {
    if (
      pathname === "/compte/connexion" ||
      pathname === "/compte/inscription" ||
      pathname === "/compte/mot-de-passe-oublie" ||
      pathname === "/compte/reinitialiser"
    ) {
      return NextResponse.next();
    }
    const authenticated = isValidUserSession(request.cookies.get(USER_COOKIE_NAME)?.value);
    if (!authenticated) {
      return NextResponse.redirect(new URL("/compte/connexion", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};

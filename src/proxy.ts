import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

function isValidSession(cookieValue: string | undefined): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!cookieValue || !secret) return false;
  const expected = createHmac("sha256", secret).update("admin-authenticated").digest("hex");
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const authenticated = isValidSession(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!authenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

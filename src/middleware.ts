import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Protects routes that require an authenticated user. Unauthenticated users
 * are redirected to /login with a `next` param so they return after signing
 * in. Authentication here is handled by Auth.js (NextAuth v5); `req.auth` is
 * the session or null.
 */
const PROTECTED = ["/place", "/profile/me", "/chats", "/chat"];

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );
  if (isProtected && !req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/place/:path*", "/profile/me", "/chats", "/chat/:path*"],
};
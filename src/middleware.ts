import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = (req.auth?.user as { role?: string })?.role;
  const connecte = !!req.auth;

  const refuse = (prefixe: string, roles: string[]) =>
    pathname.startsWith(prefixe) && (!connecte || !roles.includes(role ?? ""));

  if (
    refuse("/super-admin", ["SUPER_ADMIN"]) ||
    refuse("/admin", ["SUPER_ADMIN", "ADMIN"]) ||
    refuse("/vendeur", ["SUPER_ADMIN", "VENDEUR"])
  ) {
    const url = new URL("/connexion", req.nextUrl.origin);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/super-admin/:path*", "/admin/:path*", "/vendeur/:path*"],
};
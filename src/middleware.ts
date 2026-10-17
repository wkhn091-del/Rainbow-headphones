import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { securityHeaders } from "@/lib/security/headers";

const ACCOUNT_PREFIX = "/account";

export async function middleware(request: NextRequest) {
  const { response, user, configured } = await updateSession(request);
  const path = request.nextUrl.pathname;
  const isAccount =
    path === ACCOUNT_PREFIX || path.startsWith(`${ACCOUNT_PREFIX}/`);
  const isCheckout = path === "/checkout" || path.startsWith("/checkout/");

  const headers = securityHeaders();
  for (const [k, v] of Object.entries(headers)) {
    response.headers.set(k, v);
  }

  if (isAccount || isCheckout) {
    response.headers.set("Cache-Control", "private, no-store");
  }

  // HSTS only on HTTPS production hosts
  if (request.nextUrl.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  // Always gate /account — never expose demo orders anonymously
  if (isAccount) {
    if (!configured) {
      const login = new URL("/login", request.url);
      login.searchParams.set("setup", "1");
      return NextResponse.redirect(login);
    }
    if (!user) {
      const login = new URL("/login", request.url);
      const next = `${path}${request.nextUrl.search}`;
      if (next.startsWith("/") && !next.startsWith("//")) {
        login.searchParams.set("next", next);
      }
      return NextResponse.redirect(login);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/account/:path*",
    "/login",
    "/checkout",
    "/((?!_next/static|_next/image|favicon.ico|models/|images/|\\.well-known/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb|txt)$).*)",
  ],
};

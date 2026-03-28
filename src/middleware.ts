import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

const PROTECTED_PREFIXES = [
  "/api/users",
  "/api/favorites",
  "/api/inquiries",
  "/api/appointments",
  "/api/offers",
  "/api/transactions",
  "/api/notifications",
  "/api/stats",
  "/api/ai",
  "/api/auth/me",
  "/api/auth/assign-role",
];

function corsHeaders(origin: string, allowed: boolean) {
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes("*");

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(origin, isAllowed),
    });
  }

  if (origin && !isAllowed) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const url = request.nextUrl;
  const pathname = url.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token =
      request.cookies.get("__Secure-next-auth.session-token")?.value ??
      request.cookies.get("next-auth.session-token")?.value;

    if (!token) {
      const res = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
      Object.entries(corsHeaders(origin, isAllowed)).forEach(([k, v]) =>
        res.headers.set(k, v),
      );
      return res;
    }
  }

  const response = NextResponse.next();
  Object.entries(corsHeaders(origin, isAllowed)).forEach(([k, v]) =>
    response.headers.set(k, v),
  );
  return response;
}

export const config = {
  matcher: "/api/:path*",
};

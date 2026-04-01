import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware called for:", pathname);

  
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/api/auth",
    "/api/auth/signin",
    "/api/auth/signout",
    "/api/auth/session",
    "/api/auth/demo-login",
    "/test-dashboard",
  ];

  
  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(path) || pathname === path,
  );

  console.log("Is public path:", isPublicPath);

  
  if (isPublicPath) {
    return NextResponse.next();
  }

  
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/agent")
  ) {
    console.log("Protected route detected, checking authentication...");

    const token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET || "dev-secret-key-change-in-production",
    });

    
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      console.log("No token found, redirecting to login");
      return NextResponse.redirect(loginUrl);
    }

    console.log("Token found, role:", token.role);

    
    const userRole = token.role as string;

    
    if (pathname.startsWith("/dashboard") && userRole !== "user") {
      const correctDashboard =
        userRole === "admin" ? "/admin/dashboard" : "/agent/dashboard";
      console.log(
        `User with role ${userRole} redirected from /dashboard to ${correctDashboard}`,
      );
      return NextResponse.redirect(new URL(correctDashboard, request.url));
    }

    if (pathname.startsWith("/admin") && userRole !== "admin") {
      const correctDashboard =
        userRole === "agent" ? "/agent/dashboard" : "/dashboard/profile";
      console.log(
        `User with role ${userRole} redirected from /admin to ${correctDashboard}`,
      );
      return NextResponse.redirect(new URL(correctDashboard, request.url));
    }

    if (
      pathname.startsWith("/agent") &&
      userRole !== "agent" &&
      userRole !== "admin"
    ) {
      const correctDashboard = "/dashboard/profile";
      console.log(
        `User with role ${userRole} redirected from /agent to ${correctDashboard}`,
      );
      return NextResponse.redirect(new URL(correctDashboard, request.url));
    }

    
    if (pathname.startsWith("/admin/agents") && userRole !== "admin") {
      console.log("Non-admin user trying to access admin agents, redirecting");
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

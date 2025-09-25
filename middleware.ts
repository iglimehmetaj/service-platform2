// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect to appropriate login based on role requirement
    if (path.startsWith("/company") && token?.role !== "COMPANY") {
      return NextResponse.redirect(new URL("/auth/company/login", req.url));
    }

    if (path.startsWith("/client") && token?.role !== "CLIENT") {
      return NextResponse.redirect(new URL("/auth/client/login", req.url));
    }

    if (path.startsWith("/superadmin") && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/auth/superadmin/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/company/:path*", "/client/:path*", "/superadmin/:path*"],
};
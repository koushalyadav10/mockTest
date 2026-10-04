import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/mock/:path*",
    "/exams",
    "/exams/:path*",
    "/practice",
    "/practice/:path*",
    "/admin",
    "/admin/:path*",
    "/teacher",
    "/teacher/:path*",
    "/upload",
    "/upload/:path*",
    "/question-bank",
    "/question-bank/:path*",
    "/analytics",
    "/analytics/:path*",
    "/history",
    "/history/:path*",
    "/settings",
    "/settings/:path*",
  ],
};

function parseJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // atob is available globally in Edge runtime
    const json = atob(base64);
    const payload = JSON.parse(json);
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("examforge_session")?.value;
  const user = token ? parseJwt(token) : null;
  const path = req.nextUrl.pathname;

  // Unauthenticated user -> strictly redirect to /login
  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route redirection:
  // Admin or Teacher visiting /dashboard (student test area) -> redirect to their specialized portals
  if (path === "/dashboard") {
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (user.role === "TEACHER") {
      return NextResponse.redirect(new URL("/teacher", req.url));
    }
  }

  // Admin area -> strictly ADMIN only
  if (path.startsWith("/admin") && user.role !== "ADMIN") {
    if (user.role === "TEACHER") {
      return NextResponse.redirect(new URL("/teacher", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Teacher area -> TEACHER or ADMIN only
  if (path.startsWith("/teacher") && user.role !== "TEACHER" && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

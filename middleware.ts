import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("MIDDLEWARE:", req.nextUrl.pathname);

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin" || pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    const cookie = req.cookies.get("adminAuth")?.value ?? null;


    if (!cookie || cookie !== "true") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
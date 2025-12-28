import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Always allow NextAuth internal routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // ✅ Get session token (works on Vercel + localhost)
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoginPage = pathname === "/login";

  // 🔐 User is logged in
  if (session) {
    // Prevent logged-in users from visiting login page
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // 🔓 User is NOT logged in
  if (!session) {
    // Allow access to login page
    if (isLoginPage) {
      return NextResponse.next();
    }

    // Block everything else
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};

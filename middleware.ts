import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Debug log
  console.log(`[Middleware] Request for: ${pathname}`);

  // ✅ Always allow NextAuth internal routes AND debug route
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/debug-session")) {
    return NextResponse.next();
  }

  // ✅ Get session token (works on Vercel + localhost)
  // Fallback to hardcoded secret if env var is missing in Edge Runtime
  const secret = process.env.NEXTAUTH_SECRET || "random-secret-key-change-me";

  const session = await getToken({
    req,
    secret,
  });

  const isLoginPage = pathname === "/login";

  // Debug session state
  if (session) {
    console.log(`[Middleware] Authenticated user: ${session.email}`);
  } else {
    console.log(`[Middleware] No session found. Cookies:`, req.cookies.getAll().map(c => c.name));
  }

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
    console.log(`[Middleware] Redirecting to login`);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // 1. Check for the session token (works on both localhost and Vercel)
  // We use getToken which automatically checks standard and __Secure- cookies
  const session = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = req.nextUrl;

  // 2. Define the paths we want to protect
  // We want to block EVERYTHING except the login page and static files (images, etc)
  const isLoginPage = pathname.startsWith('/login');
  const isPublicFile = pathname.includes('.') || pathname.startsWith('/api'); 

  // 3. Logic:
  
  // A. If user is logged in...
  if (session) {
    // ...and tries to go to Login, redirect them to Dashboard
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // ...otherwise let them pass
    return NextResponse.next();
  }

  // B. If user is NOT logged in...
  if (!session) {
    // ...allow them to go to Login or download public files
    if (isLoginPage || isPublicFile) {
      return NextResponse.next();
    }
    // ...otherwise, redirect them to Login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// 4. Configure where this runs
export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
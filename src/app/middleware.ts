import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // If trying to access auth pages while logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access admin pages
  if (isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // You might want to verify admin role here
  }

  // If trying to access protected pages without token
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ]
};
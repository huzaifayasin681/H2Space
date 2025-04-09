import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the path
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || 
                       path === '/login' || 
                       path === '/register' || 
                       path === '/forgot-password' || 
                       path.startsWith('/reset-password');
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // If trying to access protected route without token, redirect to login
  if (!isPublicPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('returnUrl', path);
    return NextResponse.redirect(url);
  }
  
  // If trying to access auth routes with token, redirect to dashboard
  if (isPublicPath && path !== '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password/:path*',
    '/dashboard',
    '/content/:path*',
    '/profile',
  ],
};
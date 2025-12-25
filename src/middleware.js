import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Protected routes
        const protectedRoutes = ['/booking', '/my-bookings'];
        
        // Check if current path is protected
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        );

        // If it's a protected route, require authentication
        if (isProtectedRoute) {
          return !!token;
        }

        // All other routes are public
        return true;
      }
    },
    pages: {
      signIn: '/login',
    }
  }
);

export const config = {
  matcher: [
    '/booking/:path*',
    '/my-bookings/:path*'
  ]
};

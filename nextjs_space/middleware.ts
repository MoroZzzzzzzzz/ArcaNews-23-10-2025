
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // This function will only be called if the user is authenticated
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Protect dashboard and user-specific routes
        if (pathname.startsWith('/dashboard') || 
            pathname.startsWith('/articles/create') ||
            pathname.startsWith('/balance/topup')) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/articles/create',
    '/balance/:path*',
  ],
};

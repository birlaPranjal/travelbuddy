// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Protect '/new-user' route
  if (request.nextUrl.pathname === '/new-user') {
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    
    if (token && !token.isNewUser) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Add other route protections as needed
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/new-user', '/dashboard', '/profile'],
}
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkServerSession } from './lib/api/serverApi';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/notes');

  let isAuthenticated = !!accessToken;
  const response = NextResponse.next();
  
  if (!isAuthenticated && refreshToken) {
    try {
      const apiResponse = await checkServerSession();
      isAuthenticated = true;

      const setCookieHeader = apiResponse.headers['set-cookie'];
      if (setCookieHeader) {
        const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        cookiesArray.forEach((cookie) => {
          response.headers.append('set-cookie', cookie);
        });
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isAuthenticated) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
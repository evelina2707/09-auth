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

  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  if (isPrivateRoute) {
    if (!accessToken && refreshToken) {
      try {
        const apiResponse = await checkServerSession();
        
        const response = NextResponse.next();
        
        const setCookieHeader = apiResponse.headers['set-cookie'];
        if (setCookieHeader) {
          const cookieValue = Array.isArray(setCookieHeader) 
            ? setCookieHeader.join(', ') 
            : setCookieHeader;

          response.headers.set('set-cookie', cookieValue);
        }
        
        return response;
      } catch (error) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }

    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
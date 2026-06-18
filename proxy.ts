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
    return NextResponse.redirect(new URL('/profile', request.url)); // Згідно з ТЗ, редірект на профіль
  }

  if (isPrivateRoute) {
    if (!accessToken) {
      try {
        const response = await checkServerSession();
        
        const nextResponse = NextResponse.next();
        
        return nextResponse;
      } catch (error) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
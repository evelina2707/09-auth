import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.headers.get('cookie') || '';

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/api/auth/session',
    { headers: { cookie } }
  );
  const isAuth = res.ok;

  const isPrivate = privateRoutes.some(route => pathname.startsWith(route));
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));

  if (isPrivate && !isAuth) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  if (isPublic && isAuth) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
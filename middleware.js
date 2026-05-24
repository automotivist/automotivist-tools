// middleware.js
// Routes requests based on hostname
// automotivist.com → brand homepage (/home)
// tools.automotivist.com → tools site (normal routing)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Only rewrite root domain (not tools subdomain)
  if (
    (hostname === 'automotivist.com' || hostname === 'www.automotivist.com') &&
    url.pathname === '/'
  ) {
    url.pathname = '/home';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next|api|favicon).*)'],
};

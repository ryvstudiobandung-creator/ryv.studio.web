// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// UBAH KATA "middleware" DI SINI JADI "proxy"
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = request.cookies.get('ryv_admin_session');
    
    if (!token || token.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}
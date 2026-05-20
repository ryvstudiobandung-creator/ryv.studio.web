// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Kalau user mencoba akses /admin tapi BUKAN halaman login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Cek apakah ada cookie sesi admin
    const token = request.cookies.get('ryv_admin_session');
    
    // Kalau gak ada token, lempar ke halaman login
    if (!token || token.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Terapkan middleware ini HANYA untuk rute admin
export const config = {
  matcher: '/admin/:path*',
}
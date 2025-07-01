import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Webhook API、テストAPI、デバッグAPIは認証をスキップ
  if (pathname.startsWith('/api/webhooks/') || 
      pathname.startsWith('/api/test') ||
      pathname.startsWith('/api/debug') ||
      pathname === '/api/webhooks/line' ||
      pathname === '/api/line-webhook') {
    console.log('🔄 Skipping middleware for:', pathname);
    console.log('🔄 Request URL:', request.url);
    return NextResponse.next();
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp (static image files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 
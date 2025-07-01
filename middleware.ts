import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Webhook API、テストAPI、デバッグAPIは認証をスキップ
  if (request.nextUrl.pathname.startsWith('/api/webhooks/') || 
      request.nextUrl.pathname.startsWith('/api/test') ||
      request.nextUrl.pathname.startsWith('/api/debug')) {
    console.log('🔄 Skipping middleware for:', request.nextUrl.pathname);
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
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();
  
  // Webhook API、テストAPI、デバッグAPIは認証をスキップ
  if (pathname.startsWith('/api/webhooks/') || 
      pathname.startsWith('/api/test') ||
      pathname.startsWith('/api/debug') ||
      pathname === '/api/webhooks/line' ||
      pathname === '/api/line-webhook') {
    console.log('🔄 Skipping middleware for:', pathname);
    console.log('🔄 Request URL:', request.url);
    
    // CORS対応ヘッダーを追加
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-Line-Signature, Content-Type');
    response.headers.set('Cache-Control', 'no-store, no-cache');
    
    return response;
  }
  
  // その他のパスでは通常の認証フローを実行
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
     * - api/line-webhook (LINE webhook endpoint)
     * - api/webhooks/ (webhook endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/line-webhook|api/webhooks/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 
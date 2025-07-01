import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('DEBUG GET OK', { 
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}

export async function POST(request: NextRequest) {
  console.log('🔍 DEBUG POST request received');
  console.log('🔍 URL:', request.url);
  console.log('🔍 Method:', request.method);
  
  // すべてのヘッダーを出力
  console.log('🔍 Headers:');
  request.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });
  
  try {
    const body = await request.text();
    console.log('🔍 Body length:', body.length);
    console.log('🔍 Body content:', body);
  } catch (error) {
    console.log('🔍 Body read error:', error);
  }
  
  // 最もシンプルな200レスポンス
  return new NextResponse('DEBUG POST OK', { 
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
} 
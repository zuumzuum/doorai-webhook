import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 認証不要のSupabaseクライアント作成
async function createSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials not configured');
  }
  
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  console.log(`🔍 LINE Webhook GET request for tenant: ${tenantId}`);
  
  return NextResponse.json({
    message: 'DoorAI LINE Webhook Active',
    tenantId: tenantId || 'not specified',
    method: 'GET',
    timestamp: new Date().toISOString(),
    status: 'ready',
    version: '1.0.0'
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Line-Signature, Content-Type'
    }
  });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  console.log(`🚀 LINE Webhook POST - Tenant: ${tenantId} - ${new Date().toISOString()}`);
  
  try {
    if (!tenantId) {
      console.error('❌ Tenant ID is required');
      return new NextResponse('OK', { status: 200 }); // LINEには200を返す
    }
    
    // Supabaseクライアント作成
    const supabase = await createSupabaseClient();
    
    // リクエスト情報の取得
    const signature = request.headers.get('x-line-signature');
    const body = await request.text();
    
    console.log('📋 Request info:', {
      signature: signature ? 'present' : 'missing',
      bodyLength: body.length,
      tenantId
    });
    
    // テナント設定取得
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .select('line_channel_secret, line_channel_access_token')
      .eq('id', tenantId)
      .single();
    
    if (tenantError || !tenantData) {
      console.error('❌ Tenant not found:', tenantError?.message);
      return new NextResponse('OK', { status: 200 }); // LINEには200を返す
    }
    
    const channelSecret = tenantData.line_channel_secret;
    const accessToken = tenantData.line_channel_access_token;
    
    if (!channelSecret || !accessToken) {
      console.error('❌ LINE credentials not configured');
      return new NextResponse('OK', { status: 200 }); // LINEには200を返す
    }
    
    console.log('🔧 Credentials available:', {
      secretLength: channelSecret.length,
      tokenLength: accessToken.length
    });
    
    // 署名検証（オプション）
    if (signature && channelSecret) {
      const hash = crypto
        .createHmac('sha256', channelSecret)
        .update(body, 'utf8')
        .digest('base64');
      
      const isSignatureValid = hash === signature;
      console.log('🔒 Signature validation:', isSignatureValid ? 'PASS' : 'FAIL');
      
      if (!isSignatureValid) {
        console.warn('⚠️ Signature mismatch - proceeding anyway for debugging');
      }
    }
    
    // Webhookデータ解析
    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch (parseError) {
      console.error('❌ Failed to parse webhook data:', parseError);
      return new NextResponse('OK', { status: 200 }); // LINEには200を返す
    }
    
    const events = webhookData.events || [];
    console.log(`📨 Processing ${events.length} events`);
    
    // イベント処理
    for (const event of events) {
      if (event.type === 'message' && event.message?.type === 'text') {
        const userMessage = event.message.text;
        const replyToken = event.replyToken;
        const userId = event.source?.userId;
        
        console.log(`👤 Message from ${userId}: "${userMessage}"`);
        
        // 自動返信メッセージ生成
        let replyMessage = '';
        if (userMessage.includes('こんにちは') || userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
          replyMessage = `こんにちは！DoorAI不動産アシスタントです。何かお手伝いできることはありますか？🏠`;
        } else if (userMessage.includes('物件') || userMessage.includes('賃貸') || userMessage.includes('マンション')) {
          replyMessage = 'お探しの物件について詳しく教えてください。予算や希望エリアなどがあれば、最適な物件をご提案いたします！🏢';
        } else if (userMessage.includes('ありがとう') || userMessage.toLowerCase().includes('thank')) {
          replyMessage = 'どういたしまして！他にもご質問があればお気軽にどうぞ😊';
        } else {
          replyMessage = `メッセージありがとうございます！\n\n不動産に関するご質問をお気軽にどうぞ。物件情報や内見のご相談など、何でもお答えします🏠`;
        }
        
        console.log(`🤖 Reply: "${replyMessage}"`);
        
        // LINE返信API呼び出し
        try {
          const replyResponse = await fetch('https://api.line.me/v2/bot/message/reply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              replyToken,
              messages: [{
                type: 'text',
                text: replyMessage
              }]
            })
          });
          
          if (!replyResponse.ok) {
            const errorText = await replyResponse.text();
            console.error('❌ LINE Reply API error:', {
              status: replyResponse.status,
              statusText: replyResponse.statusText,
              error: errorText
            });
          } else {
            console.log('✅ Reply sent successfully');
          }
        } catch (replyError) {
          console.error('❌ Failed to send reply:', replyError);
        }
        
        // データベース保存
        try {
          if (userId) {
            // 会話履歴保存
            await supabase
              .from('conversations')
              .insert({
                tenant_id: tenantId,
                user_id: userId,
                message_type: 'text',
                user_message: userMessage,
                bot_reply: replyMessage,
                metadata: {},
                created_at: new Date().toISOString(),
              });
            
            // LINEユーザー情報更新
            const now = new Date().toISOString();
            await supabase
              .from('line_users')
              .upsert({
                tenant_id: tenantId,
                line_user_id: userId,
                is_blocked: false,
                last_interaction_at: now,
                updated_at: now,
              });
            
            console.log('💾 Data saved to database');
          }
        } catch (dbError) {
          console.error('❌ Database save error:', dbError);
                 }
       } else {
         console.log(`📨 Skipping event type: ${event.type}`);
       }
     }
     
     // 必ず200を返す（LINEの要求）
     return new NextResponse('OK', { 
       status: 200,
       headers: {
         'Content-Type': 'text/plain',
         'Cache-Control': 'no-store'
       }
     });
     
   } catch (error) {
     console.error('❌ Webhook processing error:', error);
     // エラーでも200を返す（LINEの要求）
     return new NextResponse('OK', { status: 200 });
   }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Line-Signature, Content-Type',
    },
  });
} 
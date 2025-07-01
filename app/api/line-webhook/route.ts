import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  console.log(`🔍 LINE Webhook GET request for tenant: ${tenantId}`);
  
  return NextResponse.json({
    message: 'LINE Webhook Endpoint - Public',
    tenantId: tenantId || 'not specified',
    method: 'GET',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  console.log(`🚀 LINE Webhook POST request received for tenant: ${tenantId}`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  
  try {
    if (!tenantId) {
      console.error('❌ Tenant ID is required');
      return new NextResponse('Tenant ID required', { status: 400 });
    }
    
    // 環境変数の確認
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Supabase credentials not configured');
      return new NextResponse('Server configuration error', { status: 500 });
    }
    
    // Supabaseクライアントを作成
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // リクエストヘッダーとボディの取得
    const signature = request.headers.get('x-line-signature');
    const body = await request.text();
    
    console.log('📝 LINE Signature:', signature);
    console.log('📄 Request body length:', body.length);
    
    // テナント設定を取得
    const { data, error } = await supabase
      .from('tenants')
      .select('line_channel_secret, line_channel_access_token')
      .eq('id', tenantId)
      .single();
    
    if (error) {
      console.error('❌ Database error:', error);
      return new NextResponse('Tenant not found', { status: 404 });
    }
    
    const channelSecret = data?.line_channel_secret || '';
    const accessToken = data?.line_channel_access_token || '';

    if (!channelSecret || !accessToken) {
      console.error('❌ LINE credentials not configured for tenant:', tenantId);
      return new NextResponse('LINE not configured', { status: 400 });
    }
    
    // 署名検証
    if (signature && channelSecret) {
      const hash = crypto
        .createHmac('sha256', channelSecret)
        .update(body, 'utf8')
        .digest('base64');
      
      if (hash !== signature) {
        console.error('❌ Signature verification failed!');
      }
    }
    
    // Webhookイベントを解析
    const webhookData = JSON.parse(body);
    const events = webhookData.events || [];
    
    console.log('📨 Events received:', events.length);
    
    // 各イベントを処理
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;
        const replyToken = event.replyToken;
        const userId = event.source?.userId;
        
        // テナント固有の自動返信ロジック
        let replyMessage = '';
        if (userMessage.includes('こんにちは') || userMessage.includes('hello')) {
          replyMessage = `こんにちは！不動産アシスタントです。何かお手伝いできることはありますか？🏠`;
        } else if (userMessage.includes('物件') || userMessage.includes('賃貸')) {
          replyMessage = 'お探しの物件について詳しく教えてください。最適な物件をご提案いたします！🏢';
        } else {
          replyMessage = `メッセージを受信しました：「${userMessage}」\n\n不動産に関するご質問をお気軽にどうぞ！`;
        }
        
        // データベースに会話履歴を保存
        if (userId) {
          try {
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
            
            console.log('✅ Conversation saved to database');
          } catch (dbError) {
            console.error('❌ Failed to save conversation:', dbError);
          }
        }
        
        // LINE Reply API で返信
        if (accessToken && replyToken) {
          const replyPayload = {
            replyToken: replyToken,
            messages: [{
              type: 'text',
              text: replyMessage
            }]
          };
          
          const lineReplyResponse = await fetch('https://api.line.me/v2/bot/message/reply', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(replyPayload)
          });
          
          if (lineReplyResponse.ok) {
            console.log('✅ Reply sent successfully to LINE');
          } else {
            console.error('❌ Failed to send reply to LINE:', lineReplyResponse.status);
          }
        }
      }
    }
    
    // 成功レスポンス
    return new NextResponse('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    
    // エラーでも200を返す
    return new NextResponse('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
} 
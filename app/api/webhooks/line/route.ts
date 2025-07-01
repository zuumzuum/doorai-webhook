import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  console.log(`🔍 LINE Webhook GET request for tenant: ${tenantId}`);
  
  return NextResponse.json({
    message: 'LINE Webhook Endpoint',
    tenantId: tenantId || 'not specified',
    method: 'GET',
    timestamp: new Date().toISOString(),
    status: 'active'
  }, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex'
    }
  });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  console.log(`🚀 LINE Webhook POST request received for tenant: ${tenantId}`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  
  // 認証不要のSupabaseクライアントを作成
  let supabase: any = null;
  
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
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // リクエストヘッダーの詳細ログ
    const headers = Object.fromEntries(request.headers.entries());
    console.log('📋 Request headers:', JSON.stringify(headers, null, 2));
    
    // LINEからの署名を取得
    const signature = request.headers.get('x-line-signature');
    console.log('📝 LINE Signature:', signature);
    
    // リクエストボディを取得
    const body = await request.text();
    console.log('📄 Request body length:', body.length);
    console.log('📄 Raw request body:', body);
    
    // テナント設定を取得
    let channelSecret: string;
    let accessToken: string;
    
    try {
      console.log(`🔍 Getting tenant settings for: ${tenantId}`);
      
      const { data, error } = await supabase
        .from('tenants')
        .select('line_channel_secret, line_channel_access_token')
        .eq('id', tenantId)
        .single();
      
      if (error) {
        console.error('❌ Database error:', error);
        return new NextResponse('Tenant not found', { status: 404 });
      }
      
      channelSecret = data?.line_channel_secret || '';
      accessToken = data?.line_channel_access_token || '';

      console.log('🔧 Channel Secret length:', channelSecret.length);
      console.log('🔧 Access Token length:', accessToken.length);
      console.log('🔧 Channel Secret preview:', channelSecret ? channelSecret.substring(0, 8) + '...' : 'EMPTY');
      console.log('🔧 Access Token preview:', accessToken ? accessToken.substring(0, 12) + '...' : 'EMPTY');

      if (!channelSecret || !accessToken) {
        console.error('❌ LINE credentials not configured for tenant:', tenantId);
        console.error('❌ Missing:', {
          channelSecret: !channelSecret,
          accessToken: !accessToken
        });
        return new NextResponse('LINE not configured', { status: 400 });
      }
    } catch (tenantError) {
      console.error('❌ Failed to get tenant settings:', tenantError);
      return new NextResponse('Tenant not found', { status: 404 });
    }
    
    console.log('🏢 Tenant ID:', tenantId);
    
    // 署名検証
    let signatureValid = false;
    if (signature && channelSecret) {
      const hash = crypto
        .createHmac('sha256', channelSecret)
        .update(body, 'utf8')
        .digest('base64');
      
      signatureValid = hash === signature;
      console.log('🔒 Generated signature:', hash);
      console.log('🔒 Received signature:', signature);
      console.log('🔒 Signatures match:', signatureValid);
      
      if (!signatureValid) {
        console.error('❌ Signature verification failed!');
        console.error('❌ This could indicate:');
        console.error('  - Incorrect Channel Secret');
        console.error('  - Request not from LINE');
        console.error('  - Network interference');
        // 署名が無効でも処理を続行（デバッグ用）
      }
    } else {
      console.log('⚠️ No signature or channel secret for verification');
    }
    
    // Webhookイベントを解析
    let webhookData: any;
    try {
      webhookData = JSON.parse(body);
      console.log('📨 Parsed webhook data:', JSON.stringify(webhookData, null, 2));
      
      const events = webhookData.events || [];
      console.log('📨 Events received:', events.length);
      
      if (events.length === 0) {
        console.log('⚠️ No events in webhook data');
        return new NextResponse('OK', { status: 200 });
      }
      
      // 各イベントを処理
      for (const event of events) {
        console.log(`📨 Processing event type: ${event.type}`);
        console.log(`📨 Event data:`, JSON.stringify(event, null, 2));
        
        // メッセージイベントの場合
        if (event.type === 'message' && event.message.type === 'text') {
          const userMessage = event.message.text;
          const replyToken = event.replyToken;
          const userId = event.source?.userId;
          
          console.log(`👤 User ID: ${userId}`);
          console.log(`👤 User message: "${userMessage}"`);
          console.log(`🎫 Reply token: ${replyToken}`);
          
          // テナント固有の自動返信ロジック
          let replyMessage = '';
          if (userMessage.includes('こんにちは') || userMessage.includes('hello') || userMessage.toLowerCase().includes('hi')) {
            replyMessage = `こんにちは！${tenantId}の不動産アシスタントです。何かお手伝いできることはありますか？🏠`;
          } else if (userMessage.includes('物件') || userMessage.includes('賃貸') || userMessage.includes('マンション') || userMessage.includes('アパート')) {
            replyMessage = 'お探しの物件について詳しく教えてください。予算や希望エリアなどがあれば、最適な物件をご提案いたします！🏢';
          } else if (userMessage.includes('ありがとう') || userMessage.includes('thanks') || userMessage.includes('thank you')) {
            replyMessage = 'どういたしまして！他にもご質問があればお気軽にどうぞ😊';
          } else {
            replyMessage = `メッセージを受信しました：「${userMessage}」\n\n不動産に関するご質問をお気軽にどうぞ！物件情報や内見のご相談など、何でもお答えします🏠`;
          }
          
          console.log(`🤖 Generated reply: "${replyMessage}"`);
          
          // データベースに会話履歴を保存
          try {
            if (userId) {
              // 会話履歴を保存
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
              
              // LINEユーザー情報を更新
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
            } else {
              console.log('⚠️ No user ID available, skipping database save');
            }
          } catch (dbError) {
            console.error('❌ Failed to save conversation:', dbError);
          }
          
          // LINE Reply API で返信
          if (accessToken && replyToken) {
            console.log('📤 Sending reply to LINE API...');
            
            const replyPayload = {
              replyToken: replyToken,
              messages: [{
                type: 'text',
                text: replyMessage
              }]
            };
            
            console.log('📤 Reply payload:', JSON.stringify(replyPayload, null, 2));
            
            const lineReplyResponse = await fetch('https://api.line.me/v2/bot/message/reply', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(replyPayload)
            });
            
            console.log('📤 LINE API response status:', lineReplyResponse.status);
            console.log('📤 LINE API response headers:', Object.fromEntries(lineReplyResponse.headers.entries()));
            
            if (lineReplyResponse.ok) {
              console.log('✅ Reply sent successfully to LINE');
              const responseText = await lineReplyResponse.text();
              console.log('✅ LINE API response:', responseText);
            } else {
              const errorText = await lineReplyResponse.text();
              console.error('❌ Failed to send reply to LINE:', lineReplyResponse.status);
              console.error('❌ LINE API error response:', errorText);
              
              // LINE APIエラーの詳細分析
              try {
                const errorJson = JSON.parse(errorText);
                console.error('❌ LINE API error details:', JSON.stringify(errorJson, null, 2));
              } catch (parseError) {
                console.error('❌ Could not parse LINE API error response');
              }
            }
          } else {
            console.error('⚠️ Missing credentials for LINE API:');
            console.error('  Access Token:', !!accessToken);
            console.error('  Reply Token:', !!replyToken);
          }
        } else {
          console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }
      }
    } catch (parseError) {
      console.error('❌ Failed to parse webhook data:', parseError);
      console.error('❌ Raw body:', body);
    }
    
    // 成功レスポンス（200 OK）
    console.log('✅ Webhook processing completed, returning 200 OK');
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
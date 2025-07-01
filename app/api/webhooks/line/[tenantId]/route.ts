import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  console.log(`🔍 LINE Webhook GET request for tenant: ${params.tenantId}`);
  
  return NextResponse.json({
    message: 'LINE Webhook Endpoint',
    tenantId: params.tenantId,
    method: 'GET',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  console.log(`🚀 LINE Webhook POST request received for tenant: ${params.tenantId}`);
  
  try {
    const tenantId = params.tenantId;
    
    // LINEからの署名を取得
    const signature = request.headers.get('x-line-signature');
    console.log('📝 LINE Signature:', signature);
    
    // リクエストボディを取得
    const body = await request.text();
    console.log('📄 Request body length:', body.length);
    
    // テナント設定を取得
    const { tenantService } = await import('@/lib/db/tenants');
    
    let channelSecret: string;
    let accessToken: string;
    
    try {
      const settings = await tenantService.getTenantLineSettings(tenantId);
      channelSecret = settings.channelSecret || '';
      accessToken = settings.accessToken || '';

      if (!channelSecret || !accessToken) {
        console.error('LINE credentials not configured for tenant:', tenantId);
        return new NextResponse('LINE not configured', { status: 400 });
      }
    } catch (tenantError) {
      console.error('Failed to get tenant settings:', tenantError);
      return new NextResponse('Tenant not found', { status: 404 });
    }
    
    console.log('🔧 Channel Secret exists:', !!channelSecret);
    console.log('🔧 Access Token exists:', !!accessToken);
    console.log('🏢 Tenant ID:', tenantId);
    
    // 署名検証
    if (signature && channelSecret) {
      const hash = crypto
        .createHmac('sha256', channelSecret)
        .update(body, 'utf8')
        .digest('base64');
      
      console.log('🔒 Generated signature:', hash);
      console.log('🔒 Received signature:', signature);
      console.log('🔒 Signatures match:', hash === signature);
    }
    
    // Webhookイベントを解析
    try {
      const webhookData = JSON.parse(body);
      const events = webhookData.events || [];
      console.log('📨 Events received:', events.length);
      
      // 各イベントを処理
      for (const event of events) {
        console.log(`📨 Processing event for tenant ${tenantId}:`, JSON.stringify(event, null, 2));
        
        // メッセージイベントの場合
        if (event.type === 'message' && event.message.type === 'text') {
          const userMessage = event.message.text;
          const replyToken = event.replyToken;
          const userId = event.source.userId;
          
          console.log(`👤 User message: "${userMessage}"`);
          console.log(`🎫 Reply token: ${replyToken}`);
          console.log(`👤 User ID: ${userId}`);
          
          // テナント固有の自動返信ロジック
          let replyMessage = '';
          if (userMessage.includes('こんにちは') || userMessage.includes('hello')) {
            replyMessage = `こんにちは！${tenantId}の不動産アシスタントです。何かお手伝いできることはありますか？🏠`;
          } else if (userMessage.includes('物件') || userMessage.includes('賃貸')) {
            replyMessage = 'お探しの物件について詳しく教えてください。予算や希望エリアなどがあれば、最適な物件をご提案いたします！';
          } else if (userMessage.includes('ありがとう')) {
            replyMessage = 'どういたしまして！他にもご質問があればお気軽にどうぞ😊';
          } else {
            replyMessage = `メッセージを受信しました：「${userMessage}」\n\n${tenantId}の不動産アシスタントです。物件に関するご質問をお気軽にどうぞ！`;
          }
          
          // データベースに会話履歴を保存
          try {
            await tenantService.saveConversation(tenantId, userId, userMessage, replyMessage);
            await tenantService.upsertLineUser(tenantId, userId);
            console.log('✅ Conversation saved to database');
          } catch (dbError) {
            console.error('❌ Failed to save conversation:', dbError);
          }
          
          // LINE Reply API で返信
          if (accessToken && replyToken) {
            const lineReplyResponse = await fetch('https://api.line.me/v2/bot/message/reply', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                replyToken: replyToken,
                messages: [{
                  type: 'text',
                  text: replyMessage
                }]
              })
            });
            
            if (lineReplyResponse.ok) {
              console.log('✅ Reply sent successfully');
            } else {
              const errorText = await lineReplyResponse.text();
              console.error('❌ Failed to send reply:', lineReplyResponse.status, errorText);
            }
          } else {
            console.log('⚠️ Missing access token or reply token');
          }
        }
      }
    } catch (parseError) {
      console.log('❌ Failed to parse webhook data:', parseError);
    }
    
    // 成功レスポンス（200 OK）
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
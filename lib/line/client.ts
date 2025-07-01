import { Client, TextMessage, FlexMessage, TemplateMessage } from '@line/bot-sdk';

// LINEクライアントの初期化
function createLineClient(accessToken: string): Client {
  return new Client({
    channelAccessToken: accessToken,
  });
}

export async function sendLineReply(replyToken: string, text: string): Promise<void> {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not set');
  }

  const client = createLineClient(accessToken);
  
  const message: TextMessage = {
    type: 'text',
    text: text,
  };

  try {
    await client.replyMessage(replyToken, message);
    console.log('LINE reply sent successfully');
  } catch (error) {
    console.error('Error sending LINE reply:', error);
    throw error;
  }
}

export async function sendLinePushMessage(userId: string, text: string): Promise<void> {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not set');
  }

  const client = createLineClient(accessToken);
  
  const message: TextMessage = {
    type: 'text',
    text: text,
  };

  try {
    await client.pushMessage(userId, message);
    console.log('LINE push message sent successfully');
  } catch (error) {
    console.error('Error sending LINE push message:', error);
    throw error;
  }
}

export async function sendPropertyCarousel(replyToken: string, properties: any[]): Promise<void> {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not set');
  }

  const client = createLineClient(accessToken);

  const columns = properties.slice(0, 10).map(property => ({
    thumbnailImageUrl: property.images?.[0] || 'https://via.placeholder.com/1024x1024?text=No+Image',
    imageBackgroundColor: '#FFFFFF',
    title: property.title.substring(0, 40),
    text: `家賃: ¥${property.rent_price?.toLocaleString() || '相談'}\n${property.station || ''} ${property.walking_minutes ? `徒歩${property.walking_minutes}分` : ''}`,
    defaultAction: {
      type: 'postback' as const,
      label: '詳細を見る',
      data: `action=view_property&property_id=${property.id}`,
    },
    actions: [
      {
        type: 'postback' as const,
        label: '詳細を見る',
        data: `action=request_info&property_id=${property.id}`,
      },
      {
        type: 'postback' as const,
        label: '内見予約',
        data: `action=book_viewing&property_id=${property.id}`,
      },
    ],
  }));

  const message: TemplateMessage = {
    type: 'template',
    altText: 'おすすめ物件のご紹介',
    template: {
      type: 'carousel',
      columns: columns,
    },
  };

  try {
    await client.replyMessage(replyToken, message);
    console.log('Property carousel sent successfully');
  } catch (error) {
    console.error('Error sending property carousel:', error);
    throw error;
  }
}

export async function sendWelcomeMessage(userId: string): Promise<void> {
  const welcomeText = `🏠 DoorAIへようこそ！

不動産に関するご質問やお部屋探しのご相談を24時間お受けしております。

例えば...
・「3万円以下の1K物件を探しています」
・「駅近の物件はありますか？」  
・「内見の予約をしたいです」

お気軽にメッセージをお送りください！`;

  try {
    await sendLinePushMessage(userId, welcomeText);
    console.log('Welcome message sent successfully');
  } catch (error) {
    console.error('Error sending welcome message:', error);
    throw error;
  }
} 
import OpenAI from 'openai';
import { getMessages, getCustomer, getProperties } from '@/lib/db/queries';
import { sendPropertyCarousel } from '@/lib/line/client';

export async function generateAIReply(customerId: string, userMessage: string): Promise<string | null> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 顧客情報と過去のメッセージ履歴を取得
    const [customer, recentMessages, properties] = await Promise.all([
      getCustomer(customerId),
      getMessages(customerId),
      getProperties(),
    ]);

    if (!customer) {
      console.error('Customer not found for AI reply generation');
      return null;
    }

    // システムプロンプトの構築
    const systemPrompt = `
あなたは不動産仲介会社「DoorAI」のAI営業担当です。以下の指針に従って顧客対応を行ってください：

## 基本方針
- 親しみやすく、丁寧な敬語で対応
- 24時間即レス対応を心がける
- 物件紹介・内見予約・資料請求に積極的に誘導
- 具体的な数字と詳細な情報を提供
- 200文字以内で簡潔に回答

## 顧客情報
- 名前: ${customer.name || '未設定'}
- 予算: ${customer.budget_min && customer.budget_max ? `${customer.budget_min.toLocaleString()}円〜${customer.budget_max.toLocaleString()}円` : '未設定'}
- 希望エリア: ${customer.desired_area || '未設定'}
- 間取り: ${customer.desired_floor_plan || '未設定'}
- ステータス: ${customer.status}

## 対応例
- 物件検索: 条件に合う物件を紹介し、具体的な提案を行う
- 予算相談: 「ご予算はいくらぐらいをお考えでしょうか？」
- 内見予約: 「内見のご希望日時をお聞かせください」
- 条件確認: 「駅からの距離はどの程度まで大丈夫ですか？」
- 緊急対応: 「お急ぎでしたら直接お電話でもご相談いただけます」

## 利用可能な物件数: ${properties.length}件

返信は親しみやすく、行動を促すような内容にしてください。
物件検索の際は、条件を詳しく聞き出してからおすすめ物件を提案してください。
`;

    // メッセージ履歴の構築（最新5件）
    const conversationHistory = recentMessages.slice(-5).reverse().map(msg => ({
      role: (msg.sender_type === 'customer' ? 'user' : 'assistant') as const,
      content: msg.content,
    }));

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory,
      { role: 'user' as const, content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const aiReply = completion.choices[0]?.message?.content;
    
    if (!aiReply) {
      console.error('No AI reply generated');
      return '申し訳ございません。少々お待ちください。';
    }

    // 物件検索要求の検出と自動対応
    await handlePropertySearch(userMessage, customerId, aiReply);

    return aiReply.trim();
  } catch (error) {
    console.error('Error generating AI reply:', error);
    return '申し訳ございません。現在システムに問題が発生しております。しばらく後に再度お試しください。';
  }
}

async function handlePropertySearch(userMessage: string, customerId: string, aiReply: string): Promise<void> {
  // 物件検索キーワードの検出
  const searchKeywords = [
    '物件', '部屋', '探し', '検索', '紹介', 'おすすめ',
    '1K', '1DK', '1LDK', '2K', '2DK', '2LDK',
    '駅近', '築浅', 'ペット可', 'バストイレ別',
  ];

  const containsSearchKeyword = searchKeywords.some(keyword => 
    userMessage.includes(keyword)
  );

  if (containsSearchKeyword) {
    try {
      const properties = await getProperties();
      const customer = await getCustomer(customerId);
      
      if (!customer || properties.length === 0) {
        return;
      }

      // 簡単な条件マッチング（実際のプロダクトではより高度な検索ロジックを実装）
      let filteredProperties = properties;

      // 予算フィルター
      if (customer.budget_max) {
        filteredProperties = filteredProperties.filter(p => 
          !p.rent_price || p.rent_price <= customer.budget_max!
        );
      }

      // 間取りフィルター
      if (customer.desired_floor_plan) {
        filteredProperties = filteredProperties.filter(p => 
          p.floor_plan?.includes(customer.desired_floor_plan!)
        );
      }

      // ステータスフィルター（利用可能な物件のみ）
      filteredProperties = filteredProperties.filter(p => 
        p.status === 'available'
      );

      // 最大5件に制限
      const recommendedProperties = filteredProperties.slice(0, 5);

      if (recommendedProperties.length > 0) {
        console.log(`Found ${recommendedProperties.length} matching properties for customer ${customerId}`);
        // 注意: replyTokenがここでは利用できないため、実際の実装では調整が必要
        // await sendPropertyCarousel(replyToken, recommendedProperties);
      }
    } catch (error) {
      console.error('Error handling property search:', error);
    }
  }
}

export async function extractCustomerInfo(userMessage: string): Promise<{
  budget_min?: number;
  budget_max?: number;
  desired_area?: string;
  desired_floor_plan?: string;
}> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
以下のメッセージから不動産に関する希望条件を抽出してください。
JSONフォーマットで回答してください。

抽出項目:
- budget_min: 最低予算（数値のみ）
- budget_max: 最高予算（数値のみ）  
- desired_area: 希望エリア（文字列）
- desired_floor_plan: 希望間取り（1K、1DK、1LDK等）

メッセージ: "${userMessage}"

例:
{"budget_min": 50000, "budget_max": 80000, "desired_area": "新宿", "desired_floor_plan": "1K"}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return {};
    }

    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return {};
    }
  } catch (error) {
    console.error('Error extracting customer info:', error);
    return {};
  }
}

export async function generatePropertyDescription(propertyData: any): Promise<string | null> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
以下の物件情報から魅力的な紹介文を作成してください：

物件情報:
- タイトル: ${propertyData.title || ''}
- 家賃: ${propertyData.rent_price ? `¥${propertyData.rent_price.toLocaleString()}` : ''}
- 敷金: ${propertyData.deposit ? `¥${propertyData.deposit.toLocaleString()}` : ''}
- 礼金: ${propertyData.key_money ? `¥${propertyData.key_money.toLocaleString()}` : ''}
- 住所: ${propertyData.address || ''}
- 最寄り駅: ${propertyData.station || ''}
- 徒歩: ${propertyData.walking_minutes ? `${propertyData.walking_minutes}分` : ''}
- 間取り: ${propertyData.floor_plan || ''}
- 面積: ${propertyData.area_sqm ? `${propertyData.area_sqm}㎡` : ''}
- 築年数: ${propertyData.year_built ? `${new Date().getFullYear() - propertyData.year_built}年` : ''}
- 構造: ${propertyData.structure || ''}
- 設備: ${propertyData.facilities?.join('、') || ''}

要件:
- 300文字以内
- 物件の魅力を強調
- 親しみやすい文体
- 具体的な数字を活用
- 住みやすさをアピール
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const description = completion.choices[0]?.message?.content;
    
    return description?.trim() || null;
  } catch (error) {
    console.error('Error generating property description:', error);
    return null;
  }
} 
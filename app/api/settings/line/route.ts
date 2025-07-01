import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, channelSecret, accessToken } = body;

    if (!tenantId || !channelSecret || !accessToken) {
      return NextResponse.json(
        { error: 'tenantId, channelSecret, accessToken are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // テナント設定をデータベースに保存（既存テナントの更新のみ）
    const { data, error } = await supabase
      .from('tenants')
      .update({
        line_channel_secret: channelSecret,
        line_channel_access_token: accessToken,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save LINE settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'LINE settings saved successfully',
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://api.doorai.com'}/api/webhooks/line?tenantId=${tenantId}`,
      data
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // テナント設定を取得
    const { data, error } = await supabase
      .from('tenants')
      .select('id, line_channel_secret, line_channel_access_token, created_at, updated_at')
      .eq('id', tenantId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tenant not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to get LINE settings' },
        { status: 500 }
      );
    }

    // セキュリティのため、秘密情報は部分的に隠す
    const responseData = {
      ...data,
      line_channel_secret: data.line_channel_secret ? '****' + data.line_channel_secret.slice(-4) : null,
      line_channel_access_token: data.line_channel_access_token ? '****' + data.line_channel_access_token.slice(-8) : null,
      isConfigured: !!(data.line_channel_secret && data.line_channel_access_token),
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
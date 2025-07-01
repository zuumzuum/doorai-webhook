import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  try {
    // 基本情報
    const basicInfo = {
      timestamp: new Date().toISOString(),
      tenantId: tenantId || 'not provided',
      url: request.url,
      method: 'GET'
    };
    
    if (!tenantId) {
      return NextResponse.json({
        success: false,
        error: 'Tenant ID is required',
        usage: 'Add ?tenantId=your-tenant-id to the URL',
        info: basicInfo
      }, { status: 400 });
    }
    
    // テナント設定の確認を試行
    let tenantInfo: any = {
      tenantId,
      status: 'checking...'
    };
    
    try {
      // Supabase接続確認
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      
      // テナント存在確認
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, line_channel_secret, line_channel_access_token')
        .eq('id', tenantId)
        .single();
      
      if (tenantError) {
        tenantInfo.error = tenantError.message;
        tenantInfo.status = 'tenant not found';
      } else {
        tenantInfo = {
          tenantId: tenant.id,
          tenantName: tenant.name,
          hasChannelSecret: !!tenant.line_channel_secret,
          hasAccessToken: !!tenant.line_channel_access_token,
          channelSecretLength: tenant.line_channel_secret?.length || 0,
          accessTokenLength: tenant.line_channel_access_token?.length || 0,
          isConfigured: !!tenant.line_channel_secret && !!tenant.line_channel_access_token,
          status: 'found'
        };
        
        // 匿名化されたプレビュー
        if (tenant.line_channel_secret) {
          tenantInfo.channelSecretPreview = tenant.line_channel_secret.substring(0, 8) + '...';
        }
        if (tenant.line_channel_access_token) {
          tenantInfo.accessTokenPreview = tenant.line_channel_access_token.substring(0, 12) + '...';
        }
      }
      
    } catch (dbError) {
      tenantInfo.error = dbError instanceof Error ? dbError.message : 'Database connection failed';
      tenantInfo.status = 'database error';
    }
    
    // Webhook URL情報
    const webhookInfo = {
      correctUrl: `https://doorai-h63zhawem-zuums-projects.vercel.app/api/webhooks/line?tenantId=${tenantId}`,
      debugUrl: `https://doorai-h63zhawem-zuums-projects.vercel.app/api/test/line-debug?tenantId=${tenantId}`,
      currentUrl: request.url
    };
    
    return NextResponse.json({
      success: true,
      basic: basicInfo,
      tenant: tenantInfo,
      webhook: webhookInfo,
      message: 'LINE Debug endpoint is working!'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  console.log(`🔍 LINE Debug request for tenant: ${tenantId}`);
  
  try {
    if (!tenantId) {
      return NextResponse.json({
        error: 'Tenant ID is required',
        usage: 'Add ?tenantId=your-tenant-id to the URL'
      }, { status: 400 });
    }
    
    // テナント設定を取得
    const { tenantService } = await import('@/lib/db/tenants');
    
    let debugInfo: any = {
      tenantId,
      timestamp: new Date().toISOString(),
    };
    
    try {
      const settings = await tenantService.getTenantLineSettings(tenantId);
      debugInfo.lineSettings = {
        hasChannelSecret: !!settings.channelSecret,
        hasAccessToken: !!settings.accessToken,
        channelSecretLength: settings.channelSecret?.length || 0,
        accessTokenLength: settings.accessToken?.length || 0,
        isConfigured: !!settings.channelSecret && !!settings.accessToken
      };
      
      // 匿名化された設定値
      if (settings.channelSecret) {
        debugInfo.lineSettings.channelSecretPreview = 
          settings.channelSecret.substring(0, 8) + '...';
      }
      if (settings.accessToken) {
        debugInfo.lineSettings.accessTokenPreview = 
          settings.accessToken.substring(0, 12) + '...';
      }
      
    } catch (tenantError) {
      debugInfo.error = {
        type: 'tenant_error',
        message: tenantError instanceof Error ? tenantError.message : 'Unknown error'
      };
    }
    
    // Webhook URL情報
    debugInfo.webhookInfo = {
      expectedUrl: `https://doorai-h63zhawem-zuums-projects.vercel.app/api/webhooks/line?tenantId=${tenantId}`,
      currentUrl: request.url,
      method: request.method
    };
    
    return NextResponse.json({
      success: true,
      debug: debugInfo
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  console.log(`🧪 LINE Test POST request for tenant: ${tenantId}`);
  
  try {
    const body = await request.text();
    const signature = request.headers.get('x-line-signature');
    
    return NextResponse.json({
      success: true,
      test: {
        tenantId,
        bodyLength: body.length,
        hasSignature: !!signature,
        signature: signature || null,
        timestamp: new Date().toISOString(),
        headers: Object.fromEntries(request.headers.entries())
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
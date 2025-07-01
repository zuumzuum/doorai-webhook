import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 環境変数の存在確認
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        error: 'Supabase credentials not configured',
        message: 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
      }, { status: 500 });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
    // 認証ユーザーを取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Please log in to access tenant information'
      }, { status: 401 });
    }
    
    // ユーザーのテナント情報を取得
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, name, created_at')
      .eq('owner_id', user.id)
      .single();
    
    if (tenantError) {
      console.error('Tenant fetch error:', tenantError);
      return NextResponse.json({ 
        error: 'Tenant not found',
        message: 'No tenant associated with this user'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        created_at: tenant.created_at
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
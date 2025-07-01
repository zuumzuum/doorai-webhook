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
    
    // ユーザーのテナント情報を取得（tenant_usersテーブル経由）
    let { data: tenantUsers, error: tenantError } = await supabase
      .from('tenant_users')
      .select(`
        *,
        tenants (
          id,
          name,
          created_at,
          subscription_status,
          trial_ends_at
        )
      `)
      .eq('user_id', user.id)
      .eq('role', 'owner');
    
    let tenant = null;
    
    // テナントが存在しない場合は新規作成
    if (!tenantUsers || tenantUsers.length === 0) {
      console.log('Creating new tenant for user:', user.id);
      
      // 新しいテナントID生成
      const newTenantId = crypto.randomUUID();
      
      // テナントを作成
      const { data: newTenant, error: createTenantError } = await supabase
        .from('tenants')
        .insert({
          id: newTenantId,
          name: user.email?.split('@')[0] || 'マイテナント',
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14日後
        })
        .select('id, name, created_at')
        .single();
      
      if (createTenantError) {
        console.error('Failed to create tenant:', createTenantError);
        return NextResponse.json({ 
          error: 'Failed to create tenant',
          message: createTenantError.message
        }, { status: 500 });
      }
      
      // ユーザーをオーナーとして関連付け
      const { error: linkError } = await supabase
        .from('tenant_users')
        .insert({
          user_id: user.id,
          tenant_id: newTenantId,
          role: 'owner'
        });
      
      if (linkError) {
        console.error('Failed to link user to tenant:', linkError);
        return NextResponse.json({ 
          error: 'Failed to link user to tenant',
          message: linkError.message
        }, { status: 500 });
      }
      
      tenant = newTenant;
    } else if (tenantError) {
      console.error('Tenant fetch error:', tenantError);
      return NextResponse.json({ 
        error: 'Tenant not found',
        message: 'Failed to fetch tenant information'
      }, { status: 404 });
    } else {
      // 既存のテナント情報を取得
      tenant = tenantUsers[0].tenants;
    }
    
    if (!tenant) {
      return NextResponse.json({ 
        error: 'Tenant not found',
        message: 'Failed to retrieve tenant information'
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
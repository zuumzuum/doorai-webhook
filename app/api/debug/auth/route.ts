import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 現在のユーザー情報を取得
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        user: null,
        session: null
      });
    }

    // セッション情報を取得
    const { data: { session } } = await supabase.auth.getSession();

    // テナント情報を取得（ユーザーがいる場合）
    let tenantInfo = null;
    if (user) {
      const { data: tenantUsers } = await supabase
        .from('tenant_users')
        .select(`
          *,
          tenants (
            id,
            name,
            domain,
            subscription_status
          )
        `)
        .eq('user_id', user.id);

      tenantInfo = tenantUsers;
    }

    return NextResponse.json({
      success: true,
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        app_metadata: user.app_metadata,
        user_metadata: user.user_metadata,
        email_confirmed_at: user.email_confirmed_at
      } : null,
      session: session ? {
        access_token: session.access_token ? 'Present' : 'Missing',
        refresh_token: session.refresh_token ? 'Present' : 'Missing',
        expires_at: session.expires_at,
        token_type: session.token_type,
        user_id: session.user?.id
      } : null,
      tenantInfo
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
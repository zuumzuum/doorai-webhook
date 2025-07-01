import { NextRequest, NextResponse } from 'next/server';
import { getCurrentTenantId, getTenant } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getCurrentTenantId();
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'テナントが見つかりません' },
        { status: 404 }
      );
    }

    const tenant = await getTenant();
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'テナント情報を取得できませんでした' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      tenant: {
        id: tenant.id,
        name: tenant.name || `テナント-${tenant.id}`,
        subscription_status: tenant.subscription_status,
        trial_ends_at: tenant.trial_ends_at,
      }
    });

  } catch (error) {
    console.error('Tenant API error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 
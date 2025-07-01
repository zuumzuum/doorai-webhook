import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export class TenantAuthService {
  private supabase: any;

  constructor() {
    this.supabase = null;
  }

  private async getClient() {
    if (!this.supabase) {
      this.supabase = await createClient();
    }
    return this.supabase;
  }

  /**
   * 現在のユーザーのテナントIDを取得
   */
  async getCurrentTenantId(): Promise<string | null> {
    const supabase = await this.getClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return null;
    }

    // JWTからテナントIDを取得
    const tenantId = user.app_metadata?.tenant_id || user.user_metadata?.tenant_id;
    return tenantId || null;
  }

  /**
   * ユーザーをテナントに関連付け
   */
  async assignUserToTenant(
    userId: string, 
    tenantId: string, 
    role: 'owner' | 'admin' | 'member' = 'member'
  ): Promise<TenantUser> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('tenant_users')
      .upsert({
        user_id: userId,
        tenant_id: tenantId,
        role: role,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign user to tenant: ${error.message}`);
    }

    // ユーザーのメタデータを更新してテナントIDを設定
    await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { tenant_id: tenantId }
    });

    return data;
  }

  /**
   * テナントを作成し、作成者をオーナーに設定
   */
  async createTenantWithOwner(
    tenantId: string,
    tenantName: string,
    ownerId: string
  ): Promise<{ tenant: any; tenantUser: TenantUser }> {
    const supabase = await this.getClient();
    
    // テナントを作成
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        id: tenantId,
        name: tenantName,
        subscription_status: 'trial',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14日後
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (tenantError) {
      throw new Error(`Failed to create tenant: ${tenantError.message}`);
    }

    // オーナーをテナントに関連付け
    const tenantUser = await this.assignUserToTenant(ownerId, tenantId, 'owner');

    return { tenant, tenantUser };
  }

  /**
   * ユーザーのテナント一覧を取得
   */
  async getUserTenants(userId: string): Promise<any[]> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('tenant_users')
      .select(`
        *,
        tenants (
          id,
          name,
          subscription_status,
          trial_ends_at
        )
      `)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to get user tenants: ${error.message}`);
    }

    return data || [];
  }

  /**
   * テナントのユーザー一覧を取得
   */
  async getTenantUsers(tenantId: string): Promise<TenantUser[]> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('tenant_users')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to get tenant users: ${error.message}`);
    }

    return data || [];
  }

  /**
   * ユーザーのテナントアクセス権限をチェック
   */
  async checkTenantAccess(userId: string, tenantId: string): Promise<boolean> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('tenant_users')
      .select('id')
      .eq('user_id', userId)
      .eq('tenant_id', tenantId)
      .single();

    return !error && !!data;
  }

  /**
   * テナント切り替え（JWTトークンを更新）
   */
  async switchTenant(tenantId: string): Promise<void> {
    const supabase = await this.getClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // アクセス権限をチェック
    const hasAccess = await this.checkTenantAccess(user.id, tenantId);
    if (!hasAccess) {
      throw new Error('Access denied to tenant');
    }

    // ユーザーのメタデータを更新
    await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: { 
        ...user.app_metadata,
        tenant_id: tenantId 
      }
    });

    // セッションを更新
    await supabase.auth.refreshSession();
  }
}

// シングルトンインスタンス
export const tenantAuthService = new TenantAuthService(); 
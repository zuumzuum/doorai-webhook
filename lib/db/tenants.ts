import { createClient } from '@/lib/supabase/server';
import { Tenant, Conversation, LineUser } from './schema';

export class TenantService {
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
   * テナントのLINE設定を取得
   */
  async getTenantLineSettings(tenantId: string): Promise<{
    channelSecret: string | null;
    accessToken: string | null;
  }> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('tenants')
      .select('line_channel_secret, line_channel_access_token')
      .eq('id', tenantId)
      .single();

    if (error) {
      throw new Error(`Failed to get tenant LINE settings: ${error.message}`);
    }

    return {
      channelSecret: data?.line_channel_secret || null,
      accessToken: data?.line_channel_access_token || null,
    };
  }

  /**
   * テナントのLINE設定を保存
   */
  async saveTenantLineSettings(
    tenantId: string,
    channelSecret: string,
    accessToken: string
  ): Promise<Tenant> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('tenants')
      .upsert({
        id: tenantId,
        line_channel_secret: channelSecret,
        line_channel_access_token: accessToken,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save tenant LINE settings: ${error.message}`);
    }

    return data;
  }

  /**
   * 会話履歴を保存
   */
  async saveConversation(
    tenantId: string,
    lineUserId: string,
    userMessage: string,
    botReply?: string,
    messageType: 'text' | 'image' | 'sticker' | 'location' | 'other' = 'text',
    metadata?: Record<string, any>
  ): Promise<Conversation> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        tenant_id: tenantId,
        user_id: lineUserId,
        message_type: messageType,
        user_message: userMessage,
        bot_reply: botReply,
        metadata: metadata,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save conversation: ${error.message}`);
    }

    return data;
  }

  /**
   * LINEユーザー情報を保存・更新
   */
  async upsertLineUser(
    tenantId: string,
    lineUserId: string,
    userInfo?: {
      displayName?: string;
      pictureUrl?: string;
      statusMessage?: string;
    }
  ): Promise<LineUser> {
    const supabase = await this.getClient();
    
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('line_users')
      .upsert({
        tenant_id: tenantId,
        line_user_id: lineUserId,
        display_name: userInfo?.displayName,
        picture_url: userInfo?.pictureUrl,
        status_message: userInfo?.statusMessage,
        is_blocked: false,
        last_interaction_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert LINE user: ${error.message}`);
    }

    return data;
  }

  /**
   * テナントの会話履歴を取得
   */
  async getConversationHistory(
    tenantId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Conversation[]> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get conversation history: ${error.message}`);
    }

    return data || [];
  }

  /**
   * テナントのLINEユーザー一覧を取得
   */
  async getLineUsers(
    tenantId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<LineUser[]> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('line_users')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('last_interaction_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get LINE users: ${error.message}`);
    }

    return data || [];
  }
}

// シングルトンインスタンス
export const tenantService = new TenantService(); 
import 'server-only';
import { cache } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * サーバーサイドで現在のユーザーを取得
 * React cacheでリクエスト中の重複を防ぐ
 * 
 * Note: 実際のプロダクション環境では、リクエストヘッダーからJWTトークンを取得し、
 * サーバーサイド専用のSupabaseクライアントを使用する必要があります。
 */
export const getCurrentUser = cache(async () => {
  try {
    // モック実装 - 実際の認証ロジックに置き換える必要があります
    console.log('Server-side auth: モック実装を使用しています');
    
    // 実際の環境では以下のような実装になります:
    // const jwt = getJWTFromRequest();
    // const { data: { user }, error } = await supabase.auth.getUser(jwt);
    
    // 開発環境用のモックユーザー
    return {
      id: 'mock-user-id',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('認証エラー:', error);
    return null;
  }
});

/**
 * サーバーサイドでセッションを取得
 */
export const getCurrentSession = cache(async () => {
  try {
    // モック実装
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }

    return {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user,
      expires_at: Date.now() + 3600000, // 1時間後
      expires_in: 3600,
      token_type: 'bearer',
    };
  } catch (error) {
    console.error('セッション取得エラー:', error);
    return null;
  }
});

/**
 * ユーザーが認証済みかチェック
 */
export const requireAuth = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('認証が必要です');
  }
  
  return user;
};

/**
 * 実際のプロダクション環境で使用するサーバーサイド認証の例
 * 
 * import { createServerClient } from '@supabase/ssr'
 * import { cookies } from 'next/headers'
 * 
 * export const createServerSupabaseClient = () => {
 *   const cookieStore = cookies()
 *   
 *   return createServerClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.SUPABASE_SERVICE_ROLE_KEY!, // サービスロールキー
 *     {
 *       cookies: {
 *         get(name: string) {
 *           return cookieStore.get(name)?.value
 *         },
 *       },
 *     }
 *   )
 * }
 * 
 * export const getCurrentUser = cache(async () => {
 *   const supabase = createServerSupabaseClient()
 *   const { data: { user }, error } = await supabase.auth.getUser()
 *   
 *   if (error || !user) {
 *     return null
 *   }
 *   
 *   return user
 * })
 */ 
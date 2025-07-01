'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth-server';
import { 
  CreateCustomerSchema, 
  UpdateCustomerSchema,
  type CreateCustomer,
  type UpdateCustomer 
} from '@/lib/validations/customer';

// Server Action状態の型定義
export interface ActionState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: any;
}

/**
 * 顧客を作成するServer Action
 */
export async function createCustomer(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 認証チェック
    const user = await requireAuth();

    // フォームデータをオブジェクトに変換
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      property_interest: formData.get('property_interest'),
      budget_range: formData.get('budget_range'),
      status: formData.get('status') || 'lead',
      language: formData.get('language') || 'ja',
      source: formData.get('source') || 'web',
      tags: formData.getAll('tags'),
      memo: formData.get('memo'),
    };

    // バリデーション
    const validatedData = CreateCustomerSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'データの形式が正しくありません',
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    // データベースに保存
    const { data, error } = await supabase
      .from('customers')
      .insert({
        ...validatedData.data,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('顧客作成エラー:', error);
      return {
        success: false,
        message: 'データベースエラーが発生しました',
      };
    }

    // キャッシュを無効化
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/customers');

    return {
      success: true,
      message: '顧客が正常に作成されました',
      data: data,
    };

  } catch (error) {
    console.error('Server Action エラー:', error);
    
    if (error instanceof Error && error.message === '認証が必要です') {
      redirect('/login');
    }

    return {
      success: false,
      message: 'サーバーエラーが発生しました',
    };
  }
}

/**
 * 顧客を更新するServer Action
 */
export async function updateCustomer(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 認証チェック
    const user = await requireAuth();

    // フォームデータをオブジェクトに変換
    const rawData = {
      id: parseInt(formData.get('id') as string),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      property_interest: formData.get('property_interest'),
      budget_range: formData.get('budget_range'),
      status: formData.get('status'),
      language: formData.get('language'),
      source: formData.get('source'),
      tags: formData.getAll('tags'),
      memo: formData.get('memo'),
    };

    // バリデーション
    const validatedData = UpdateCustomerSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'データの形式が正しくありません',
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { id, ...updateData } = validatedData.data;

    // データベースを更新
    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // 所有権チェック
      .select()
      .single();

    if (error) {
      console.error('顧客更新エラー:', error);
      return {
        success: false,
        message: 'データベースエラーが発生しました',
      };
    }

    if (!data) {
      return {
        success: false,
        message: '指定された顧客が見つからないか、アクセス権限がありません',
      };
    }

    // キャッシュを無効化
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/customers');
    revalidatePath(`/dashboard/customers/${id}`);

    return {
      success: true,
      message: '顧客情報が正常に更新されました',
      data: data,
    };

  } catch (error) {
    console.error('Server Action エラー:', error);
    
    if (error instanceof Error && error.message === '認証が必要です') {
      redirect('/login');
    }

    return {
      success: false,
      message: 'サーバーエラーが発生しました',
    };
  }
}

/**
 * 顧客を削除するServer Action
 */
export async function deleteCustomer(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 認証チェック
    const user = await requireAuth();

    const customerId = parseInt(formData.get('id') as string);

    if (!customerId) {
      return {
        success: false,
        message: '顧客IDが必要です',
      };
    }

    // データベースから削除
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)
      .eq('user_id', user.id); // 所有権チェック

    if (error) {
      console.error('顧客削除エラー:', error);
      return {
        success: false,
        message: 'データベースエラーが発生しました',
      };
    }

    // キャッシュを無効化
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/customers');

    return {
      success: true,
      message: '顧客が正常に削除されました',
    };

  } catch (error) {
    console.error('Server Action エラー:', error);
    
    if (error instanceof Error && error.message === '認証が必要です') {
      redirect('/login');
    }

    return {
      success: false,
      message: 'サーバーエラーが発生しました',
    };
  }
}

/**
 * 顧客のホットスコアを更新するServer Action
 */
export async function updateHotScore(
  customerId: number,
  interactionData: {
    interaction_count?: number;
    response_time?: number;
    engagement_score?: number;
  }
): Promise<ActionState> {
  try {
    // 認証チェック
    const user = await requireAuth();

    // ホットスコア計算ロジック（簡易版）
    const baseScore = 50;
    const interactionBonus = (interactionData.interaction_count || 0) * 2;
    const responseTimeBonus = interactionData.response_time 
      ? Math.max(0, 20 - interactionData.response_time / 60) 
      : 0;
    const engagementBonus = interactionData.engagement_score || 0;
    
    const hotScore = Math.min(100, Math.max(0, 
      baseScore + interactionBonus + responseTimeBonus + engagementBonus * 0.3
    ));

    // データベースを更新（実際のスキーマに合わせて調整）
    const { error } = await supabase
      .from('customers')
      .update({ 
        hot_score: hotScore,
        last_interaction: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', customerId)
      .eq('user_id', user.id);

    if (error) {
      console.error('ホットスコア更新エラー:', error);
      return {
        success: false,
        message: 'データベースエラーが発生しました',
      };
    }

    // キャッシュを無効化
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/customers');
    revalidatePath(`/dashboard/customers/${customerId}`);

    return {
      success: true,
      message: 'ホットスコアが更新されました',
      data: { hotScore },
    };

  } catch (error) {
    console.error('Server Action エラー:', error);
    
    if (error instanceof Error && error.message === '認証が必要です') {
      redirect('/login');
    }

    return {
      success: false,
      message: 'サーバーエラーが発生しました',
    };
  }
} 
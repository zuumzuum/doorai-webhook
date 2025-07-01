'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth-server';
import { 
  CreatePropertySchema, 
  UpdatePropertySchema,
  PropertyCSVSchema,
  type CreateProperty,
  type UpdateProperty,
  type PropertyCSV
} from '@/lib/validations/property';
import type { ActionState } from './customer-actions';

/**
 * 物件を作成するServer Action
 */
export async function createProperty(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 認証チェック
    const user = await requireAuth();

    // フォームデータをオブジェクトに変換
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      property_type: formData.get('property_type'),
      status: formData.get('status') || 'available',
      address: formData.get('address'),
      area: parseFloat(formData.get('area') as string),
      rooms: formData.get('rooms') ? parseInt(formData.get('rooms') as string) : undefined,
      bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : undefined,
      floor: formData.get('floor') ? parseInt(formData.get('floor') as string) : undefined,
      building_age: formData.get('building_age') ? parseInt(formData.get('building_age') as string) : undefined,
      parking: formData.get('parking') === 'true',
      features: formData.getAll('features'),
      images: formData.getAll('images'),
      location: formData.get('latitude') && formData.get('longitude') ? {
        latitude: parseFloat(formData.get('latitude') as string),
        longitude: parseFloat(formData.get('longitude') as string),
      } : undefined,
      nearest_station: formData.get('nearest_station'),
      station_distance: formData.get('station_distance') ? parseFloat(formData.get('station_distance') as string) : undefined,
      published: formData.get('published') === 'true',
    };

    // バリデーション
    const validatedData = CreatePropertySchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'データの形式が正しくありません',
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    // データベースに保存
    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...validatedData.data,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('物件作成エラー:', error);
      return {
        success: false,
        message: 'データベースエラーが発生しました',
      };
    }

    // キャッシュを無効化
    revalidatePath('/dashboard');
    revalidatePath('/properties');

    return {
      success: true,
      message: '物件が正常に作成されました',
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
 * 物件を更新するServer Action
 */
export async function updateProperty(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 認証チェック
    const user = await requireAuth();

    // フォームデータをオブジェクトに変換
    const rawData = {
      id: parseInt(formData.get('id') as string),
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price') ? parseFloat(formData.get('price') as string) : undefined,
      property_type: formData.get('property_type'),
      status: formData.get('status'),
      address: formData.get('address'),
      area: formData.get('area') ? parseFloat(formData.get('area') as string) : undefined,
      rooms: formData.get('rooms') ? parseInt(formData.get('rooms') as string) : undefined,
      bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : undefined,
      floor: formData.get('floor') ? parseInt(formData.get('floor') as string) : undefined,
      building_age: formData.get('building_age') ? parseInt(formData.get('building_age') as string) : undefined,
      parking: formData.get('parking') === 'true',
      features: formData.getAll('features'),
      images: formData.getAll('images'),
      location: formData.get('latitude') && formData.get('longitude') ? {
        latitude: parseFloat(formData.get('latitude') as string),
        longitude: parseFloat(formData.get('longitude') as string),
      } : undefined,
      nearest_station: formData.get('nearest_station'),
      station_distance: formData.get('station_distance') ? parseFloat(formData.get('station_distance') as string) : undefined,
      published: formData.get('published') === 'true',
    };

    // バリデーション
    const validatedData = UpdatePropertySchema.safeParse(rawData);

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
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // 所有権チェック
      .select()
      .single();

    if (error) {
      console.error('物件更新エラー:', error);
      return {
        success: false,
        message: 'データベースエラーが発生しました',
      };
    }

    if (!data) {
      return {
        success: false,
        message: '指定された物件が見つからないか、アクセス権限がありません',
      };
    }

    // キャッシュを無効化
    revalidatePath('/dashboard');
    revalidatePath('/properties');
    revalidatePath(`/properties/${id}`);

    return {
      success: true,
      message: '物件情報が正常に更新されました',
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
 * 物件を削除するServer Action
 */
export async function deleteProperty(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 認証チェック
    const user = await requireAuth();

    const propertyId = parseInt(formData.get('id') as string);

    if (!propertyId) {
      return {
        success: false,
        message: '物件IDが必要です',
      };
    }

    // データベースから削除
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('user_id', user.id); // 所有権チェック

    if (error) {
      console.error('物件削除エラー:', error);
      return {
        success: false,
        message: 'データベースエラーが発生しました',
      };
    }

    // キャッシュを無効化
    revalidatePath('/dashboard');
    revalidatePath('/properties');

    return {
      success: true,
      message: '物件が正常に削除されました',
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
 * CSVから物件を一括インポートするServer Action
 */
export async function importPropertiesFromCSV(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // 認証チェック
    const user = await requireAuth();

    const file = formData.get('csv_file') as File;
    
    if (!file) {
      return {
        success: false,
        message: 'CSVファイルが選択されていません',
      };
    }

    // CSVファイルを読み込み
    const csvText = await file.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length <= 1) {
      return {
        success: false,
        message: 'CSVファイルにデータが含まれていません',
      };
    }

    // ヘッダー行を除く
    const headers = lines[0].split(',').map(h => h.trim());
    const dataLines = lines.slice(1);

    const results = {
      success: 0,
      errors: 0,
      details: [] as string[],
    };

    // 各行を処理
    for (let i = 0; i < dataLines.length; i++) {
      const values = dataLines[i].split(',').map(v => v.trim());
      
      // ヘッダーと値をマッピング
      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });

      try {
        // バリデーション
        const validatedData = PropertyCSVSchema.safeParse(rowData);

        if (!validatedData.success) {
          results.errors++;
          results.details.push(`行 ${i + 2}: バリデーションエラー - ${validatedData.error.issues.map(e => e.message).join(', ')}`);
          continue;
        }

        // データベースに挿入
        const { error } = await supabase
          .from('properties')
          .insert({
            ...validatedData.data,
            user_id: user.id,
            status: 'available',
            published: false,
          });

        if (error) {
          results.errors++;
          results.details.push(`行 ${i + 2}: データベースエラー - ${error.message}`);
        } else {
          results.success++;
        }

      } catch (error) {
        results.errors++;
        results.details.push(`行 ${i + 2}: 処理エラー - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // キャッシュを無効化
    if (results.success > 0) {
      revalidatePath('/dashboard');
      revalidatePath('/properties');
    }

    return {
      success: results.success > 0,
      message: `処理完了: ${results.success}件成功, ${results.errors}件エラー`,
      data: results,
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
 * 物件の公開状態を切り替えるServer Action
 */
export async function togglePropertyPublished(
  propertyId: number,
  published: boolean
): Promise<ActionState> {
  try {
    // 認証チェック
    const user = await requireAuth();

    // データベースを更新
    const { data, error } = await supabase
      .from('properties')
      .update({ 
        published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', propertyId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('物件公開状態更新エラー:', error);
      return {
        success: false,
        message: 'データベースエラーが発生しました',
      };
    }

    if (!data) {
      return {
        success: false,
        message: '指定された物件が見つからないか、アクセス権限がありません',
      };
    }

    // キャッシュを無効化
    revalidatePath('/dashboard');
    revalidatePath('/properties');
    revalidatePath(`/properties/${propertyId}`);

    return {
      success: true,
      message: `物件が${published ? '公開' : '非公開'}に設定されました`,
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
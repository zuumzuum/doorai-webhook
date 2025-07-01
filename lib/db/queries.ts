import 'server-only';
import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser as getAuthUser } from '@/lib/auth-server';
import type { CustomerSearch, PropertySearch } from '@/lib/validations/customer';
import { createClient } from '@/lib/supabase/server';
import type {
  Tenant,
  User,
  Property,
  Customer,
  Message,
  Booking,
  HotScore,
  KpiDaily,
  CustomerWithHotScore,
  MessageWithCustomer,
  BookingWithDetails,
  PropertyWithBookings,
  CreatePropertyInput,
  CreateCustomerInput,
  CreateBookingInput,
  CreateMessageInput,
} from './schema';

// Legacy Customer関連のクエリ (既存コードとの互換性のため)

/**
 * 認証済みユーザーの顧客一覧を取得 (Legacy)
 * React cacheでリクエスト中の重複を防ぐ
 */
export const getCustomersLegacy = cache(async (searchParams?: CustomerSearch) => {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('認証が必要です');
  }

  let query = supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // 検索フィルターの適用
  if (searchParams?.query) {
    query = query.or(`name.ilike.%${searchParams.query}%,email.ilike.%${searchParams.query}%`);
  }

  if (searchParams?.status) {
    query = query.eq('status', searchParams.status);
  }

  if (searchParams?.language) {
    query = query.eq('language', searchParams.language);
  }

  if (searchParams?.source) {
    query = query.eq('source', searchParams.source);
  }

  // ページネーション
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('顧客取得エラー:', error);
    throw new Error('顧客データの取得に失敗しました');
  }

  return {
    customers: data || [],
    totalCount: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
});

/**
 * 特定の顧客を取得
 */
export const getCustomerById = cache(async (id: number) => {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('認証が必要です');
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('顧客が見つかりませんでした');
    }
    console.error('顧客取得エラー:', error);
    throw new Error('顧客データの取得に失敗しました');
  }

  return data;
});

/**
 * 顧客のホットスコアを取得
 */
export const getCustomerHotScores = cache(async () => {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('認証が必要です');
  }

  // モック実装 - 実際のDBスキーマに合わせて調整
  const { data: customers, error } = await supabase
    .from('customers')
    .select('id, name, email, status, created_at')
    .eq('user_id', user.id);

  if (error) {
    console.error('ホットスコア取得エラー:', error);
    throw new Error('ホットスコアの取得に失敗しました');
  }

  // 簡易的なホットスコア計算（実際のロジックに置き換え）
  const hotScores = customers?.map((customer: any) => ({
    ...customer,
    hotScore: Math.floor(Math.random() * 100), // モック値
    lastInteraction: new Date(),
  })) || [];

  return hotScores;
});

// Property関連のクエリ

/**
 * 認証済みユーザーの物件一覧を取得 (Legacy)
 */
export const getPropertiesLegacy = cache(async (searchParams?: PropertySearch) => {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('認証が必要です');
  }

  let query = supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // 検索フィルターの適用
  if (searchParams?.query) {
    query = query.or(`title.ilike.%${searchParams.query}%,address.ilike.%${searchParams.query}%`);
  }

  if (searchParams?.property_type) {
    query = query.eq('property_type', searchParams.property_type);
  }

  if (searchParams?.status) {
    query = query.eq('status', searchParams.status);
  }

  if (searchParams?.min_price) {
    query = query.gte('price', searchParams.min_price);
  }

  if (searchParams?.max_price) {
    query = query.lte('price', searchParams.max_price);
  }

  if (searchParams?.min_area) {
    query = query.gte('area', searchParams.min_area);
  }

  if (searchParams?.max_area) {
    query = query.lte('area', searchParams.max_area);
  }

  if (searchParams?.rooms !== undefined) {
    query = query.eq('rooms', searchParams.rooms);
  }

  if (searchParams?.parking !== undefined) {
    query = query.eq('parking', searchParams.parking);
  }

  if (searchParams?.published !== undefined) {
    query = query.eq('published', searchParams.published);
  }

  // ページネーション
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('物件取得エラー:', error);
    throw new Error('物件データの取得に失敗しました');
  }

  return {
    properties: data || [],
    totalCount: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
});

/**
 * 特定の物件を取得
 */
export const getPropertyById = cache(async (id: number) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('認証が必要です');
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('物件が見つかりませんでした');
    }
    console.error('物件取得エラー:', error);
    throw new Error('物件データの取得に失敗しました');
  }

  return data;
});

// Analytics関連のクエリ

/**
 * ダッシュボード用のKPIデータを取得
 */
export const getDashboardKPIs = cache(async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('認証が必要です');
  }

  try {
    // 並列でデータを取得
    const [
      { count: totalCustomers },
      { count: totalProperties },
      { count: activeProperties },
      { count: contractedCustomers }
    ] = await Promise.all([
      supabase.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('properties').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('properties').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'available'),
      supabase.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'contracted')
    ]);

    const safeTotal = totalCustomers || 0;
    const safeContracted = contractedCustomers || 0;

    return {
      totalCustomers: safeTotal,
      totalProperties: totalProperties || 0,
      activeProperties: activeProperties || 0,
      contractedCustomers: safeContracted,
      conversionRate: safeTotal > 0 ? (safeContracted / safeTotal * 100) : 0,
    };
  } catch (error) {
    console.error('KPIデータ取得エラー:', error);
    throw new Error('ダッシュボードデータの取得に失敗しました');
  }
}); 

// Helper function to get current user's tenant_id
export async function getCurrentTenantId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single();
    
  return data?.tenant_id || null;
}

// Tenant queries
export async function getTenant(): Promise<Tenant | null> {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) return null;
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single();
    
  return data;
}

export async function updateTenant(updates: Partial<Tenant>): Promise<Tenant | null> {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) return null;
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', tenantId)
    .select()
    .single();
    
  return data;
}

// User queries
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return data;
}

export async function updateUser(updates: Partial<User>): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
    
  return data;
}

// Property queries
export async function getProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
    
  return data || [];
}

export async function getProperty(id: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
    
  return data;
}

export async function createProperty(input: CreatePropertyInput): Promise<Property | null> {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) return null;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data } = await supabase
    .from('properties')
    .insert({
      ...input,
      tenant_id: tenantId,
      created_by: user?.id,
    })
    .select()
    .single();
    
  return data;
}

export async function updateProperty(id: string, updates: Partial<CreatePropertyInput>): Promise<Property | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return data;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
    
  return !error;
}

export async function getPropertiesWithBookings(): Promise<PropertyWithBookings[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('properties')
    .select(`
      *,
      bookings (*)
    `)
    .order('created_at', { ascending: false });
    
  return (data || []).map(property => ({
    ...property,
    booking_count: property.bookings?.length || 0,
  }));
}

// Customer queries
export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
    
  return data || [];
}

export async function getCustomersWithHotScores(): Promise<CustomerWithHotScore[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .select(`
      *,
      hot_score:hot_scores(*)
    `)
    .order('created_at', { ascending: false });
    
  return (data || []).map(customer => ({
    ...customer,
    hot_score: customer.hot_score?.[0] || undefined,
  }));
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
    
  return data;
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer | null> {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) return null;
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .insert({
      ...input,
      tenant_id: tenantId,
    })
    .select()
    .single();
    
  return data;
}

export async function updateCustomer(id: string, updates: Partial<CreateCustomerInput>): Promise<Customer | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return data;
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
    
  return !error;
}

export async function findCustomerByLineUserId(lineUserId: string): Promise<Customer | null> {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) return null;
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('line_user_id', lineUserId)
    .single();
    
  return data;
}

export async function findCustomerByWebSessionId(sessionId: string): Promise<Customer | null> {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) return null;
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('web_session_id', sessionId)
    .single();
    
  return data;
}

// Message queries
export async function getMessages(customerId?: string): Promise<MessageWithCustomer[]> {
  const supabase = await createClient();
  let query = supabase
    .from('messages')
    .select(`
      *,
      customer:customers(*)
    `)
    .order('created_at', { ascending: false });
    
  if (customerId) {
    query = query.eq('customer_id', customerId);
  }
  
  const { data } = await query.limit(100);
  return data || [];
}

export async function createMessage(input: CreateMessageInput): Promise<Message | null> {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) return null;
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('messages')
    .insert({
      ...input,
      tenant_id: tenantId,
    })
    .select()
    .single();
    
  return data;
}

export async function getRecentMessages(limit: number = 10): Promise<MessageWithCustomer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('messages')
    .select(`
      *,
      customer:customers(*)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  return data || [];
}

// Booking queries
export async function getBookings(): Promise<BookingWithDetails[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:customers(*),
      property:properties(*)
    `)
    .order('booking_datetime', { ascending: true });
    
  return data || [];
}

export async function getBooking(id: string): Promise<BookingWithDetails | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:customers(*),
      property:properties(*)
    `)
    .eq('id', id)
    .single();
    
  return data;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking | null> {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) return null;
  
  const supabase = await createClient();
  const { data } = await supabase
    .from('bookings')
    .insert({
      ...input,
      tenant_id: tenantId,
    })
    .select()
    .single();
    
  return data;
}

export async function updateBooking(id: string, updates: Partial<CreateBookingInput>): Promise<Booking | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return data;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);
    
  return !error;
}

// Hot Score queries
export async function getHotScores(): Promise<HotScore[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('hot_scores')
    .select('*')
    .order('score', { ascending: false });
    
  return data || [];
}

export async function updateHotScore(customerId: string): Promise<number | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .rpc('rpc_update_hot_score', { customer_uuid: customerId });
    
  return data;
}

// KPI queries
export async function getKpiDaily(): Promise<KpiDaily[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('kpi_daily')
    .select('*')
    .order('date', { ascending: false })
    .limit(30);
    
  return data || [];
}

export async function refreshKpiDaily(): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('refresh_kpi_daily');
  return !error;
}

// Analytics queries
export async function getDashboardStats() {
  const supabase = await createClient();
  
  // Get today's stats
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const [
    { count: totalCustomers },
    { count: newInquiriesToday },
    { count: newInquiriesWeek },
    { count: newInquiriesMonth },
    { count: totalProperties },
    { count: totalBookings },
  ] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('customers').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from('customers').select('*', { count: 'exact', head: true }).gte('created_at', monthAgo),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
  ]);
  
  return {
    totalCustomers: totalCustomers || 0,
    newInquiriesToday: newInquiriesToday || 0,
    newInquiriesWeek: newInquiriesWeek || 0,
    newInquiriesMonth: newInquiriesMonth || 0,
    totalProperties: totalProperties || 0,
    totalBookings: totalBookings || 0,
  };
} 
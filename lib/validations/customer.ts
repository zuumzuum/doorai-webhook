import { z } from 'zod';

// 顧客作成用スキーマ
export const CreateCustomerSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().min(10, '電話番号は10桁以上で入力してください').max(15, '電話番号は15桁以内で入力してください'),
  property_interest: z.string().optional(),
  budget_range: z.string().optional(),
  status: z.enum(['lead', 'contacted', 'viewing_scheduled', 'negotiating', 'contracted']).default('lead'),
  language: z.enum(['ja', 'en']).default('ja'),
  source: z.enum(['web', 'line', 'instagram', 'referral', 'other']).default('web'),
  tags: z.array(z.string()).default([]),
  memo: z.string().optional(),
});

// 顧客更新用スキーマ
export const UpdateCustomerSchema = CreateCustomerSchema.partial().extend({
  id: z.number().positive('IDは正の数値である必要があります'),
});

// 顧客検索用スキーマ
export const CustomerSearchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['lead', 'contacted', 'viewing_scheduled', 'negotiating', 'contracted']).optional(),
  language: z.enum(['ja', 'en']).optional(),
  source: z.enum(['web', 'line', 'instagram', 'referral', 'other']).optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
});

// 物件検索用スキーマ（property.tsからの再エクスポート）
export const PropertySearchSchema = z.object({
  query: z.string().optional(),
  property_type: z.enum(['apartment', 'house', 'condo', 'office', 'commercial', 'land']).optional(),
  status: z.enum(['available', 'reserved', 'contracted', 'sold']).optional(),
  min_price: z.number().nonnegative().optional(),
  max_price: z.number().nonnegative().optional(),
  min_area: z.number().nonnegative().optional(),
  max_area: z.number().nonnegative().optional(),
  rooms: z.number().nonnegative().optional(),
  parking: z.boolean().optional(),
  published: z.boolean().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
});

// 型定義をエクスポート
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
export type CustomerSearch = z.infer<typeof CustomerSearchSchema>;
export type PropertySearch = z.infer<typeof PropertySearchSchema>;

// ホットスコア計算用スキーマ
export const HotScoreUpdateSchema = z.object({
  customer_id: z.number().positive(),
  interaction_count: z.number().nonnegative().default(0),
  response_time: z.number().nonnegative().optional(),
  engagement_score: z.number().min(0).max(100).default(0),
  last_interaction: z.date().optional(),
});

export type HotScoreUpdate = z.infer<typeof HotScoreUpdateSchema>; 
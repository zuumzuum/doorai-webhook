import { z } from 'zod';

// 物件作成用スキーマ
export const CreatePropertySchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  description: z.string().optional(),
  price: z.number().positive('価格は正の数値である必要があります'),
  property_type: z.enum(['apartment', 'house', 'condo', 'office', 'commercial', 'land']),
  status: z.enum(['available', 'reserved', 'contracted', 'sold']).default('available'),
  address: z.string().min(1, '住所は必須です'),
  area: z.number().positive('面積は正の数値である必要があります'),
  rooms: z.number().nonnegative('部屋数は0以上である必要があります').optional(),
  bathrooms: z.number().nonnegative('バスルーム数は0以上である必要があります').optional(),
  floor: z.number().optional(),
  building_age: z.number().nonnegative('築年数は0以上である必要があります').optional(),
  parking: z.boolean().default(false),
  features: z.array(z.string()).default([]),
  images: z.array(z.string().url('有効なURLを入力してください')).default([]),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  nearest_station: z.string().optional(),
  station_distance: z.number().nonnegative().optional(),
  published: z.boolean().default(false),
});

// 物件更新用スキーマ
export const UpdatePropertySchema = CreatePropertySchema.partial().extend({
  id: z.number().positive('IDは正の数値である必要があります'),
});

// 物件検索用スキーマ
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

// CSVインポート用スキーマ
export const PropertyCSVSchema = z.object({
  title: z.string(),
  price: z.string().transform((val, ctx) => {
    const parsed = parseFloat(val.replace(/[,¥]/g, ''));
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '価格は数値である必要があります',
      });
      return z.NEVER;
    }
    return parsed;
  }),
  property_type: z.string(),
  address: z.string(),
  area: z.string().transform((val, ctx) => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '面積は数値である必要があります',
      });
      return z.NEVER;
    }
    return parsed;
  }),
  rooms: z.string().transform((val) => val ? parseInt(val, 10) : undefined).optional(),
  description: z.string().optional(),
});

// 型定義をエクスポート
export type CreateProperty = z.infer<typeof CreatePropertySchema>;
export type UpdateProperty = z.infer<typeof UpdatePropertySchema>;
export type PropertySearch = z.infer<typeof PropertySearchSchema>;
export type PropertyCSV = z.infer<typeof PropertyCSVSchema>; 
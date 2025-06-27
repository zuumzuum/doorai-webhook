'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Sparkles, X } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const propertySchema = z.object({
  name: z.string().min(1, '物件名は必須です'),
  address: z.string().min(1, '所在地は必須です'),
  type: z.string().min(1, '種別を選択してください'),
  station: z.string().min(1, '最寄り駅は必須です'),
  walkTime: z.number().min(1, '徒歩時間は1分以上で入力してください'),
  layout: z.string().min(1, '間取りを選択してください'),
  area: z.number().min(1, '面積は必須です'),
  rent: z.number().min(1, '賃料/価格は必須です'),
  managementFee: z.number().optional(),
  buildDate: z.date({ required_error: '築年月は必須です' }),
  structure: z.string().min(1, '構造を選択してください'),
  facilities: z.array(z.string()).optional(),
  nearbyTags: z.array(z.string()).optional(),
  targetResident: z.string().optional(),
  prKeywords: z.array(z.string()).max(3, 'PRキーワードは最大3つまでです').optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const facilityOptions = [
  'オートロック', '宅配ボックス', 'エレベーター', 'バルコニー', 
  'エアコン', '都市ガス', 'インターネット対応', 'ペット可'
];

export function QuickForm() {
  const [previewText, setPreviewText] = useState('ここにAI紹介文が表示されます…');
  const [isGenerating, setIsGenerating] = useState(false);
  const [nearbyTags, setNearbyTags] = useState<string[]>([]);
  const [prKeywords, setPrKeywords] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const watchedValues = watch();

  const onSubmit = (data: PropertyFormData) => {
    console.log('Form submitted:', { ...data, nearbyTags, prKeywords });
    // TODO: バックエンド呼び出し
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // TODO: fetch('/api/generate-description')
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPreviewText(`${watchedValues.name || '物件名未入力'}は、${watchedValues.station || '駅名未入力'}から徒歩${watchedValues.walkTime || 0}分の好立地にある${watchedValues.layout || '間取り未選択'}の物件です。築年数も浅く、現代的な設備が充実しており、快適な住環境を提供します。`);
    } catch (error) {
      console.error('Description generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addNearbyTag = () => {
    if (newTag && !nearbyTags.includes(newTag)) {
      setNearbyTags([...nearbyTags, newTag]);
      setNewTag('');
    }
  };

  const removeNearbyTag = (tag: string) => {
    setNearbyTags(nearbyTags.filter(t => t !== tag));
  };

  const addPrKeyword = () => {
    if (newKeyword && !prKeywords.includes(newKeyword) && prKeywords.length < 3) {
      setPrKeywords([...prKeywords, newKeyword]);
      setNewKeyword('');
    }
  };

  const removePrKeyword = (keyword: string) => {
    setPrKeywords(prKeywords.filter(k => k !== keyword));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-heading font-semibold mb-4">基本情報</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">物件名 *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="mt-1"
                  placeholder="例: 新宿区西新宿マンション"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="address">所在地 *</Label>
                <Input
                  id="address"
                  {...register('address')}
                  className="mt-1"
                  placeholder="例: 東京都新宿区西新宿1-1-1"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <Label htmlFor="type">種別 *</Label>
                <Select onValueChange={(value) => setValue('type', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="種別を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rental-mansion">賃貸マンション</SelectItem>
                    <SelectItem value="rental-house">賃貸戸建て</SelectItem>
                    <SelectItem value="sale">売買</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="station">最寄り駅 *</Label>
                  <Input
                    id="station"
                    {...register('station')}
                    className="mt-1"
                    placeholder="例: 新宿駅"
                  />
                  {errors.station && <p className="text-red-500 text-sm mt-1">{errors.station.message}</p>}
                </div>
                <div>
                  <Label htmlFor="walkTime">徒歩分 *</Label>
                  <Input
                    id="walkTime"
                    type="number"
                    {...register('walkTime', { valueAsNumber: true })}
                    className="mt-1"
                    placeholder="10"
                  />
                  {errors.walkTime && <p className="text-red-500 text-sm mt-1">{errors.walkTime.message}</p>}
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-heading font-semibold mb-4">物件詳細</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="layout">間取り *</Label>
                  <Select onValueChange={(value) => setValue('layout', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="間取りを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1R">1R</SelectItem>
                      <SelectItem value="1K">1K</SelectItem>
                      <SelectItem value="1DK">1DK</SelectItem>
                      <SelectItem value="1LDK">1LDK</SelectItem>
                      <SelectItem value="2K">2K</SelectItem>
                      <SelectItem value="2DK">2DK</SelectItem>
                      <SelectItem value="2LDK">2LDK</SelectItem>
                      <SelectItem value="3LDK">3LDK</SelectItem>
                      <SelectItem value="4LDK">4LDK</SelectItem>
                      <SelectItem value="5LDK">5LDK</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.layout && <p className="text-red-500 text-sm mt-1">{errors.layout.message}</p>}
                </div>
                <div>
                  <Label htmlFor="area">面積 (㎡) *</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.1"
                    {...register('area', { valueAsNumber: true })}
                    className="mt-1"
                    placeholder="35.5"
                  />
                  {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent">賃料/価格 (円) *</Label>
                  <Input
                    id="rent"
                    type="number"
                    {...register('rent', { valueAsNumber: true })}
                    className="mt-1"
                    placeholder="115000"
                  />
                  {errors.rent && <p className="text-red-500 text-sm mt-1">{errors.rent.message}</p>}
                </div>
                <div>
                  <Label htmlFor="managementFee">管理費 (円)</Label>
                  <Input
                    id="managementFee"
                    type="number"
                    {...register('managementFee', { valueAsNumber: true })}
                    className="mt-1"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>築年月 *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watchedValues.buildDate ? format(watchedValues.buildDate, 'yyyy年MM月', { locale: ja }) : '築年月を選択'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={watchedValues.buildDate}
                        onSelect={(date) => setValue('buildDate', date!)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.buildDate && <p className="text-red-500 text-sm mt-1">{errors.buildDate.message}</p>}
                </div>
                <div>
                  <Label htmlFor="structure">構造 *</Label>
                  <Select onValueChange={(value) => setValue('structure', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="構造を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RC">RC造</SelectItem>
                      <SelectItem value="wood">木造</SelectItem>
                      <SelectItem value="steel">S造</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.structure && <p className="text-red-500 text-sm mt-1">{errors.structure.message}</p>}
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-heading font-semibold mb-4">設備・その他</h3>
            <div className="space-y-4">
              <div>
                <Label>主な設備</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {facilityOptions.map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Checkbox
                        id={facility}
                        onCheckedChange={(checked) => {
                          const current = watchedValues.facilities || [];
                          if (checked) {
                            setValue('facilities', [...current, facility]);
                          } else {
                            setValue('facilities', current.filter(f => f !== facility));
                          }
                        }}
                      />
                      <Label htmlFor={facility} className="text-sm">{facility}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>周辺施設タグ</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="タグを入力"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addNearbyTag} variant="outline">
                    追加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {nearbyTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeNearbyTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="targetResident">想定入居者</Label>
                <Select onValueChange={(value) => setValue('targetResident', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="想定入居者を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">シングル</SelectItem>
                    <SelectItem value="couple">カップル</SelectItem>
                    <SelectItem value="family">ファミリー</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>PRキーワード (最大3つ)</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="キーワードを入力"
                    className="flex-1"
                    disabled={prKeywords.length >= 3}
                  />
                  <Button 
                    type="button" 
                    onClick={addPrKeyword} 
                    variant="outline"
                    disabled={prKeywords.length >= 3}
                  >
                    追加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {prKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
                      <span>{keyword}</span>
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removePrKeyword(keyword)} />
                    </Badge>
                  ))}
                </div>
                {errors.prKeywords && <p className="text-red-500 text-sm mt-1">{errors.prKeywords.message}</p>}
              </div>
            </div>
          </Card>

          <div className="flex space-x-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              物件を登録
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              下書き保存
            </Button>
          </div>
        </div>

        {/* Right Column - AI Preview */}
        <div className="sticky top-4 max-h-[80vh] overflow-auto">
          <Card className="rounded-2xl shadow-md p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>AI紹介文プレビュー</span>
                </span>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? '生成中...' : '再生成'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-muted/50 rounded-xl p-4 min-h-[200px]">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {previewText}
                </p>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                ※ 入力内容に基づいてAIが自動生成します
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
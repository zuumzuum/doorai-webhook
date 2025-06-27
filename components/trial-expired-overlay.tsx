'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Zap, Clock, BarChart3, X } from 'lucide-react';
import { Pricing } from '@/components/blocks/pricing';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const japanesePlans = [
  {
    name: 'STARTER',
    price: '29,800',
    yearlyPrice: '25,800',
    period: '/ 月',
    features: [
      { text: 'AIチャット即時応答（LINE / Web）', included: true },
      { text: 'Instagram / Messenger 追加', included: false },
      { text: 'AI紹介文自動生成数', value: '100/月' },
      { text: 'KPI ダッシュボード', included: true },
      { text: '多店舗対応', included: false },
      { text: 'API・外部システム連携', included: false },
      { text: '専用CS・SLA', included: false },
      { text: '初期導入サポート', included: false },
    ],
    description: '個人事業主・小規模店舗に最適',
    buttonText: '今すぐ始める',
    href: '/sign-up',
    isPopular: false,
  },
  {
    name: 'PRO',
    price: '49,800',
    yearlyPrice: '42,800',
    period: '/ 月',
    features: [
      { text: 'AIチャット即時応答（LINE / Web）', included: true },
      { text: 'Instagram / Messenger 追加', included: true },
      { text: 'AI紹介文自動生成数', value: '無制限' },
      { text: 'KPI ダッシュボード', included: true },
      { text: '多店舗対応', value: '3店舗' },
      { text: 'API・外部システム連携', included: false },
      { text: '専用CS・SLA', value: '優先チャット' },
      { text: '初期導入サポート', value: 'オンラインガイド' },
    ],
    description: '成長中の不動産会社に理想的',
    buttonText: '今すぐ始める',
    href: '/sign-up',
    isPopular: true,
  },
  {
    name: 'ENTERPRISE',
    price: '98,000',
    yearlyPrice: '84,000',
    period: '/ 月',
    features: [
      { text: 'AIチャット即時応答（LINE / Web）', included: true },
      { text: 'Instagram / Messenger 追加', included: true },
      { text: 'AI紹介文自動生成数', value: '無制限' },
      { text: 'KPI ダッシュボード', included: true },
      { text: '多店舗対応', value: '無制限' },
      { text: 'API・外部システム連携', included: true },
      { text: '専用CS・SLA', value: '専属チーム' },
      { text: '初期導入サポート', value: '現地研修' },
    ],
    description: '大規模組織・特別なニーズに対応',
    buttonText: '営業担当に相談',
    href: '/contact',
    isPopular: false,
  },
];

export function TrialExpiredOverlay() {
  const [showPricing, setShowPricing] = useState(false);
  
  // Mock data - これらは将来的に実際のユーザーデータに置き換えられます
  const mockData = {
    inquiries: 247,
    viewings: 89,
    hoursSaved: 156,
    responseTime: 30
  };

  if (showPricing) {
    return (
      <Dialog open={true}>
        <DialogContent className="max-w-7xl max-h-[90vh] p-0 border-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>あなたに最適なプランを選択</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPricing(false)}
              className="absolute top-4 right-4 z-10 h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="overflow-y-auto max-h-[90vh]">
              <Pricing
                plans={japanesePlans}
                title="あなたに最適なプランを選択"
                description="DoorAIで不動産営業を自動化し、売上を最大化しましょう\n14日間の無料トライアルで効果を実感してください"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-2xl p-0 border-0 bg-transparent shadow-none">
        <div className="text-center space-y-6 p-8 bg-white rounded-2xl shadow-2xl">
          <DialogTitle className="text-3xl font-semibold text-brand">
            DoorAI トライアルが終了しました！
          </DialogTitle>

          <p className="text-lg leading-relaxed">
            この 14 日間で{' '}
            <span className="font-semibold text-brand">
              【{mockData.inquiries}件の問い合わせ】
            </span>{' '}
            に即レスし、
            <br />
            <span className="font-semibold text-brand">
              【{mockData.viewings}件の内見予約】
            </span>{' '}
            を自動獲得。
            <br />
            あなたの時間を{' '}
            <span className="font-semibold text-brand">
              {mockData.hoursSaved} 時間
            </span>{' '}
            節約しました。
          </p>

          <ul className="text-left mx-auto max-w-md space-y-3">
            <li className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-brand flex-shrink-0" />
              <span>
                1件でも成約すれば月額の <strong>3 倍</strong> 以上のリターン
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand flex-shrink-0" />
              <span>
                応答速度 <strong>{mockData.responseTime} 秒</strong> で競合に圧勝
              </span>
            </li>
            <li className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-brand flex-shrink-0" />
              <span>
                KPI ダッシュボードで ROI を"見える化"
              </span>
            </li>
          </ul>

          <div className="bg-brand/10 rounded-2xl p-4 mt-4">
            <p className="text-sm text-brand">
              今プランを選択すると{' '}
              <span className="font-semibold">今月の API 追加料金が無料</span>{' '}
              になる特典付き！
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              onClick={() => setShowPricing(true)}
              className="px-8 py-3 rounded-full bg-brand text-white shadow-lg hover:bg-brand/90 transition-all duration-200 text-lg font-medium"
            >
              今すぐ月額プランを開始する
            </Button>
            <Button 
              variant="link" 
              onClick={() => setShowPricing(true)}
              className="text-sm text-brand-light underline hover:text-brand transition-colors"
            >
              年間契約で 1 か月分無料にする
            </Button>
          </div>

          <p className="text-xs text-gray-500 pt-2 leading-relaxed">
            ※いつでもプラン変更・解約可能。
            <br />
            質問があれば{' '}
            <a href="/support" className="underline hover:text-brand transition-colors">
              サポート
            </a>{' '}
            までお気軽に！
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
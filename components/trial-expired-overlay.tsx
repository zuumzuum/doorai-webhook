'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Zap, Clock, BarChart3, Settings } from 'lucide-react';

export function TrialExpiredOverlay() {
  // Mock data - これらは将来的に実際のユーザーデータに置き換えられます
  const mockData = {
    inquiries: 247,
    viewings: 89,
    hoursSaved: 156,
    responseTime: 30
  };

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
              継続利用をご希望の場合は、設定画面からプランをご確認ください。
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 pt-4">
            <Button 
              className="px-8 py-3 rounded-full bg-brand text-white shadow-lg hover:bg-brand/90 transition-all duration-200 text-lg font-medium flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              設定画面でプランを確認
            </Button>
          </div>

          <p className="text-xs text-gray-500 pt-2 leading-relaxed">
            ※プラン詳細は設定タブの「サブスクリプション」からご確認いただけます。
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
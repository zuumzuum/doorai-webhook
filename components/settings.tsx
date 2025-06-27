'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Pricing } from '@/components/blocks/pricing';
import { 
  Settings as SettingsIcon, 
  MessageSquare, 
  Globe, 
  CreditCard, 
  Key, 
  Calendar,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  X
} from 'lucide-react';

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

export function Settings() {
  const [lineToken, setLineToken] = useState('');
  const [webhookUrl] = useState('https://api.doorai.com/webhook/line/abc123');
  const [englishResponse, setEnglishResponse] = useState(true);
  const [autoBooking, setAutoBooking] = useState(true);
  const [copied, setCopied] = useState(false);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">設定</h1>
            <p className="text-muted-foreground">システム設定と連携の管理</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LINE Integration */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span>LINE連携設定</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Channel Access Token
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="password"
                    value={lineToken}
                    onChange={(e) => setLineToken(e.target.value)}
                    placeholder="Channel Access Tokenを入力"
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Key className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Webhook URL
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="flex-1 bg-muted"
                  />
                  <Button variant="outline" onClick={copyWebhookUrl}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  このURLをLINE Developersコンソールに設定してください
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">接続ステータス</p>
                  <p className="text-xs text-green-700 dark:text-green-300">正常に接続されています</p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" variant="secondary">
                  接続中
                </Badge>
              </div>

              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                LINE Developersで設定
              </Button>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span>多言語設定</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">英語自動応答</p>
                  <p className="text-sm text-muted-foreground">英語での問い合わせに自動で対応</p>
                </div>
                <Switch
                  checked={englishResponse}
                  onCheckedChange={setEnglishResponse}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">自動内見予約</p>
                  <p className="text-sm text-muted-foreground">条件に合う物件の内見予約を自動送信</p>
                </div>
                <Switch
                  checked={autoBooking}
                  onCheckedChange={setAutoBooking}
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">言語検知機能</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      顧客のメッセージを自動で判定し、適切な言語で応答します
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="font-bold text-lg text-foreground">75%</div>
                  <div className="text-muted-foreground">日本語対応</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="font-bold text-lg text-foreground">25%</div>
                  <div className="text-muted-foreground">英語対応</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Calendar Integration */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <span>Google Calendar連携</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">接続ステータス</p>
                  <p className="text-xs text-muted-foreground">
                    {googleCalendarConnected ? 'Googleアカウントに接続済み' : '未接続'}
                  </p>
                </div>
                <Badge 
                  className={googleCalendarConnected ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"} 
                  variant="secondary"
                >
                  {googleCalendarConnected ? '接続済み' : '未接続'}
                </Badge>
              </div>

              {!googleCalendarConnected ? (
                <Button 
                  className="w-full" 
                  onClick={() => setGoogleCalendarConnected(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Google Calendarに接続
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">今月作成したイベント:</span>
                      <span className="font-medium">45件</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">自動同期:</span>
                      <span className="font-medium">有効</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    カレンダー設定を変更
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Settings */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span>サブスクリプション</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">プロプラン</h3>
                    <p className="text-sm text-muted-foreground">月額 ¥30,000</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" variant="secondary">
                    アクティブ
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">次回請求日:</span>
                    <span className="font-medium">2024年2月15日</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">支払い方法:</span>
                    <span className="font-medium">**** 1234</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">プラン特典</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>無制限の問い合わせ対応</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>多言語対応（日本語・英語）</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>詳細アナリティクス</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>優先サポート</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  請求履歴
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowPricing(true)}
                >
                  プラン変更
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-muted-foreground" />
              <span>システム状況</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-green-900 dark:text-green-100">AIエージェント</h3>
                <p className="text-sm text-green-600 dark:text-green-300">正常稼働中</p>
                <div className="mt-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" variant="secondary">
                    オンライン
                  </Badge>
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">API接続</h3>
                <p className="text-sm text-blue-600 dark:text-blue-300">正常稼働中</p>
                <div className="mt-2">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" variant="secondary">
                    接続中
                  </Badge>
                </div>
              </div>

              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium text-purple-900 dark:text-purple-100">外部連携</h3>
                <p className="text-sm text-purple-600 dark:text-purple-300">正常稼働中</p>
                <div className="mt-2">
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" variant="secondary">
                    同期中
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Dialog */}
      {showPricing && (
        <Dialog open={true} onOpenChange={setShowPricing}>
          <DialogContent className="max-w-7xl max-h-[90vh] p-0 border-0 bg-background rounded-2xl shadow-2xl overflow-hidden">
            <VisuallyHidden>
              <DialogTitle>プラン変更</DialogTitle>
            </VisuallyHidden>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPricing(false)}
                className="absolute top-4 right-4 z-10 h-8 w-8 p-0 hover:bg-accent"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="overflow-y-auto max-h-[90vh]">
                <Pricing
                  plans={japanesePlans}
                  title="プラン変更"
                  description="現在のプランを変更して、より多くの機能をご利用ください\nアップグレードは即座に反映され、ダウングレードは次回請求日から適用されます"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
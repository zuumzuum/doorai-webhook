'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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
  X,
  Star,
  Zap,
  Clock,
  TrendingUp,
  Save,
  Link,
  Info
} from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "LINE・Webチャット即応",
    description: "お客様からの問い合わせに24時間AI が自動対応"
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "AI 紹介文生成",
    description: "物件の魅力を自動で分析し、売れる紹介文を生成"
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "KPI ダッシュボード",
    description: "成約率・対応時間・顧客満足度をリアルタイム分析"
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "14日間無料トライアル",
    description: "導入前にじっくり効果を確認いただけます"
  }
]

const includedFeatures = [
  "LINE・Webチャット自動対応",
  "AI物件紹介文生成（無制限）",
  "リアルタイム分析ダッシュボード",
  "顧客管理・追客機能",
  "成約率向上レポート",
  "24時間サポート対応",
  "セキュリティ保護・データバックアップ",
  "月次改善提案レポート"
]

export function Settings() {
  const [lineChannelSecret, setLineChannelSecret] = useState('');
  const [lineAccessToken, setLineAccessToken] = useState('');
  const [tenantId, setTenantId] = useState('demo-company'); // 実際はログインユーザーから取得
  const [tenantName, setTenantName] = useState('デモ会社');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [englishResponse, setEnglishResponse] = useState(true);
  const [autoBooking, setAutoBooking] = useState(true);
  const [copied, setCopied] = useState(false);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [lineConnected, setLineConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // テナント情報の初期化
  useEffect(() => {
    const initializeTenantInfo = async () => {
      try {
        // 現在のテナント情報を取得
        const response = await fetch('/api/tenant/current');
        console.log('Tenant API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Tenant API response data:', data);
          
          if (data.success && data.tenant) {
            setTenantId(data.tenant.id);
            setTenantName(data.tenant.name || `テナント-${data.tenant.id}`);
            setWebhookUrl(`https://project-qcydeydbv-zuums-projects.vercel.app/api/line-webhook?tenantId=${data.tenant.id}`);
            
            // 既存のLINE設定を取得
            try {
              const lineResponse = await fetch(`/api/settings/line?tenantId=${data.tenant.id}`);
              if (lineResponse.ok) {
                const lineData = await lineResponse.json();
                setLineConnected(lineData.data?.isConfigured || false);
              }
            } catch (error) {
              console.error('Failed to load LINE settings:', error);
            }
          } else if (data.tenant) {
            // 旧形式のレスポンス対応
            setTenantId(data.tenant.id);
            setTenantName(data.tenant.name || `テナント-${data.tenant.id}`);
            setWebhookUrl(`https://project-qcydeydbv-zuums-projects.vercel.app/api/line-webhook?tenantId=${data.tenant.id}`);
          } else {
            throw new Error('Invalid tenant data structure');
          }
        } else {
          const errorData = await response.text();
          console.error('Tenant API error:', response.status, errorData);
          
          if (response.status === 401) {
            alert('認証が必要です。ログインしてください。');
          } else if (response.status === 404) {
            alert('テナント情報が見つかりません。新規ユーザーの場合は、テナントの作成が必要です。');
          } else {
            alert(`テナント情報の取得に失敗しました (${response.status})`);
          }
        }
      } catch (error) {
        console.error('Failed to load tenant info:', error);
        alert('ネットワークエラー: テナント情報の取得に失敗しました');
      }
    };

    initializeTenantInfo();
  }, []);

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLineConnection = async () => {
    if (!lineChannelSecret || !lineAccessToken) {
      alert('Channel SecretとAccess Tokenの両方を入力してください');
      return;
    }

    setIsConnecting(true);
    
    try {
      // TODO: APIエンドポイントに送信してテナント設定を保存
      const response = await fetch('/api/settings/line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          channelSecret: lineChannelSecret,
          accessToken: lineAccessToken,
        }),
      });

      if (response.ok) {
        setLineConnected(true);
        alert('LINE連携が正常に設定されました！');
      } else {
        throw new Error('設定の保存に失敗しました');
      }
    } catch (error) {
      console.error('LINE connection error:', error);
      alert('LINE連携の設定中にエラーが発生しました');
    } finally {
      setIsConnecting(false);
    }
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
          {/* Tenant Information */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5 text-blue-600" />
                <span>テナント情報</span>
              </CardTitle>
              <CardDescription>
                現在ログイン中の会社・店舗情報
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">{tenantName}</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">テナントID: {tenantId}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" variant="secondary">
                    アクティブ
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">プラン</span>
                  <span className="font-medium">無料トライアル</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">LINE連携</span>
                  <span className={`font-medium ${lineConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {lineConnected ? '設定済み' : '未設定'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">トライアル残り</span>
                  <span className="font-medium">12日</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                プラン変更・課金設定
              </Button>
            </CardContent>
          </Card>

          {/* LINE Integration */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span>LINE公式アカウント連携</span>
              </CardTitle>
              <CardDescription>
                あなたのLINE公式アカウントにDoorAI自動応答機能を追加します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ステップ1: Webhook URL */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Webhook URL をコピー</h4>
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="flex-1 bg-white dark:bg-gray-800 text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* ステップ2: LINE Console設定 */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <h4 className="font-medium text-amber-900 dark:text-amber-100">LINE Developers Console で設定</h4>
                </div>
                <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <p>• Messaging API → Webhook URL に上記URLをペースト</p>
                  <p>• Webhook送信を「利用する」に設定</p>
                  <p>• 応答メッセージを「利用しない」に設定</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  LINE Developers Console を開く
                </Button>
              </div>

              {/* ステップ3: 認証情報入力 */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">認証情報を入力</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Channel Secret
                    </label>
                    <Input
                      type="password"
                      value={lineChannelSecret}
                      onChange={(e) => setLineChannelSecret(e.target.value)}
                      placeholder="LINE Developersから取得したChannel Secret"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Channel Access Token
                    </label>
                    <Input
                      type="password"
                      value={lineAccessToken}
                      onChange={(e) => setLineAccessToken(e.target.value)}
                      placeholder="LINE Developersから取得したAccess Token"
                      className="w-full"
                    />
                  </div>

                  <Button 
                    onClick={handleLineConnection}
                    disabled={isConnecting || !lineChannelSecret || !lineAccessToken}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        連携中...
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-2" />
                        LINE Bot を連携開始
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* 接続ステータス */}
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                lineConnected 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-gray-50 dark:bg-gray-900/20'
              }`}>
                <div>
                  <p className={`text-sm font-medium ${
                    lineConnected 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    接続ステータス
                  </p>
                  <p className={`text-xs ${
                    lineConnected 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {lineConnected ? '正常に接続されています' : '未接続'}
                  </p>
                </div>
                <Badge 
                  className={lineConnected 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                  } 
                  variant="secondary"
                >
                  {lineConnected ? '接続中' : '未接続'}
                </Badge>
              </div>

              {/* ヘルプ情報 */}
              <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">設定でお困りの場合</p>
                  <p>詳細な設定手順は<a href="#" className="underline">こちらのガイド</a>をご確認ください。</p>
                </div>
              </div>
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
                  <p className="text-sm text-muted-foreground">空いている時間に自動で内見予約</p>
                </div>
                <Switch
                  checked={autoBooking}
                  onCheckedChange={setAutoBooking}
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">多言語応答状況</span>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <div className="flex justify-between">
                    <span>今月の英語応答:</span>
                    <span className="font-medium">127件</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平均応答時間:</span>
                    <span className="font-medium">0.8秒</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Calendar Integration */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-600" />
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
                    <h3 className="font-semibold text-foreground">DoorAI Pro</h3>
                    <p className="text-sm text-muted-foreground">月額 ¥29,800（税込）</p>
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
                    <span>24時間AI自動対応</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>AI物件紹介文生成（無制限）</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>リアルタイム分析ダッシュボード</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>24時間サポート対応</span>
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
          <DialogContent className="max-w-lg p-0 border-0 bg-background rounded-2xl shadow-2xl overflow-hidden">
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
              
              <div className="p-6">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                  <Badge className="mb-4 bg-primary/10 text-primary px-4 py-2">
                    月3万円で24h働くウルトラ営業マン
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    プラン変更
                  </h2>
                  <p className="text-muted-foreground">
                    シンプルで透明な料金体系
                  </p>
                </div>

                {/* メインプライシングカード */}
                <Card className="relative overflow-hidden border-2 border-primary shadow-lg">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary/80"></div>
                  
                  <CardHeader className="text-center pt-6 pb-4">
                    <Badge className="mb-3 bg-primary text-primary-foreground w-fit mx-auto px-3 py-1">
                      おすすめ
                    </Badge>
                    <CardTitle className="text-2xl font-bold text-foreground">DoorAI Pro</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      不動産仲介業務を完全自動化
                    </CardDescription>
                    <div className="mt-4">
                      <div className="flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">¥29,800</span>
                        <span className="text-lg text-muted-foreground ml-2">/ 月</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">税込み・初期費用なし</p>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 pb-4">
                    <div className="space-y-3 mb-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            {feature.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">含まれる機能：</h4>
                      <div className="space-y-1">
                        {includedFeatures.slice(0, 6).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-primary flex-shrink-0" />
                            <span className="text-xs text-foreground">{feature}</span>
                          </div>
                        ))}
                        <p className="text-xs text-muted-foreground mt-2">他2つの機能も含まれます</p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pb-6">
                    <div className="w-full space-y-2">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 font-semibold rounded-lg">
                        このプランに変更
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        変更は即座に反映されます
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
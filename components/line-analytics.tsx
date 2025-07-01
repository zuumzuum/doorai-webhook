'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

interface ConversationStats {
  totalConversations: number;
  activeUsers: number;
  avgResponseTime: number;
  responseRate: number;
  todayMessages: number;
  weeklyMessages: number;
  monthlyMessages: number;
}

interface ConversationData {
  id: string;
  user_id: string;
  user_message: string;
  bot_reply: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  resolved: boolean;
  created_at: string;
  line_user?: {
    display_name?: string;
    picture_url?: string;
  };
}

interface HourlyData {
  hour: number;
  messages: number;
}

export function LineAnalytics() {
  const [stats, setStats] = useState<ConversationStats>({
    totalConversations: 0,
    activeUsers: 0,
    avgResponseTime: 0,
    responseRate: 0,
    todayMessages: 0,
    weeklyMessages: 0,
    monthlyMessages: 0,
  });
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // TODO: 実際のAPIエンドポイントから取得
      const tenantId = 'demo-company'; // 実際はuseAuthから取得
      
      const [statsResponse, conversationsResponse] = await Promise.all([
        fetch(`/api/analytics/line/stats?tenantId=${tenantId}&range=${dateRange}`),
        fetch(`/api/analytics/line/conversations?tenantId=${tenantId}&range=${dateRange}`)
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data || stats);
      }

      if (conversationsResponse.ok) {
        const conversationsData = await conversationsResponse.json();
        setConversations(conversationsData.data || []);
      }

      // デモデータ（開発用）
      setStats({
        totalConversations: 127,
        activeUsers: 89,
        avgResponseTime: 1.2,
        responseRate: 94.5,
        todayMessages: 23,
        weeklyMessages: 156,
        monthlyMessages: 678,
      });

      // 時間別メッセージ数のデモデータ
      setHourlyData(
        Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          messages: Math.floor(Math.random() * 20) + 1
        }))
      );

    } catch (error) {
      console.error('Analytics data loading error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(1)}秒`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}分`;
    return `${(seconds / 3600).toFixed(1)}時間`;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="w-4 h-4" />;
      case 'negative': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">LINE分析</h1>
          <p className="text-muted-foreground">チャット対応の分析とレポート</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnalyticsData}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            更新
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* 日付範囲選択 */}
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">期間:</span>
        <div className="flex space-x-1">
          {[
            { value: '1d', label: '今日' },
            { value: '7d', label: '7日間' },
            { value: '30d', label: '30日間' },
            { value: '90d', label: '90日間' }
          ].map((range) => (
            <Button
              key={range.value}
              variant={dateRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">総会話数</p>
                <p className="text-2xl font-bold">{stats.totalConversations}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +12% 前週比
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">アクティブユーザー</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +8% 前週比
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">平均応答時間</p>
                <p className="text-2xl font-bold">{formatTime(stats.avgResponseTime)}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              -15% 前週比
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">応答率</p>
                <p className="text-2xl font-bold">{stats.responseRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +2% 前週比
            </p>
          </CardContent>
        </Card>
      </div>

      {/* タブコンテンツ */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="conversations">会話履歴</TabsTrigger>
          <TabsTrigger value="users">ユーザー分析</TabsTrigger>
          <TabsTrigger value="performance">パフォーマンス</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 時間別メッセージ数 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>時間別メッセージ数</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-1">
                  {hourlyData.map((data) => (
                    <div
                      key={data.hour}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className="bg-blue-500 rounded-t w-full min-h-[4px]"
                        style={{
                          height: `${(data.messages / Math.max(...hourlyData.map(d => d.messages))) * 200}px`
                        }}
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        {data.hour}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* トップ質問カテゴリ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>質問カテゴリ</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { category: '物件相談', count: 45, percentage: 35.4, color: 'bg-blue-500' },
                  { category: '価格・費用', count: 32, percentage: 25.2, color: 'bg-green-500' },
                  { category: '内見予約', count: 28, percentage: 22.0, color: 'bg-orange-500' },
                  { category: 'その他', count: 22, percentage: 17.3, color: 'bg-gray-500' },
                ].map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.count}件</div>
                      <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>最近の会話履歴</CardTitle>
              <CardDescription>
                ユーザーとの会話履歴と感情分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: '1',
                    user_message: '駅近の1LDKを探しています。予算は10万円程度です。',
                    bot_reply: 'ご要望承りました！駅近の1LDK、予算10万円程度でしたら、いくつかおすすめ物件がございます。まず、A駅徒歩3分の築浅マンションはいかがでしょうか？',
                    sentiment: 'positive' as const,
                    resolved: true,
                    created_at: '2024-01-20T10:30:00Z',
                    line_user: { display_name: '田中様' }
                  },
                  {
                    id: '2',
                    user_message: '内見の予約をキャンセルしたいです',
                    bot_reply: '承知いたしました。内見予約のキャンセルを承ります。ご都合が悪くなられたのですね。改めて別の日程でのご提案も可能ですので、お気軽にお声掛けください。',
                    sentiment: 'negative' as const,
                    resolved: true,
                    created_at: '2024-01-20T09:15:00Z',
                    line_user: { display_name: '佐藤様' }
                  },
                  {
                    id: '3',
                    user_message: 'ペット可の物件はありますか？',
                    bot_reply: 'ペット可の物件もご用意がございます！猫・小型犬であれば対応可能な物件を複数ご紹介できます。具体的にどのようなペットをお飼いでしょうか？',
                    sentiment: 'neutral' as const,
                    resolved: false,
                    created_at: '2024-01-20T08:45:00Z',
                    line_user: { display_name: '山田様' }
                  }
                ].map((conversation) => (
                  <div key={conversation.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{conversation.line_user?.display_name || 'ユーザー'}</span>
                        <Badge
                          className={`${getSentimentColor(conversation.sentiment)} border-0`}
                          variant="secondary"
                        >
                          <span className="flex items-center space-x-1">
                            {getSentimentIcon(conversation.sentiment)}
                            <span className="capitalize">{conversation.sentiment || 'neutral'}</span>
                          </span>
                        </Badge>
                        <Badge variant={conversation.resolved ? 'default' : 'secondary'}>
                          {conversation.resolved ? '解決済み' : '未解決'}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(conversation.created_at).toLocaleString('ja-JP')}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-sm"><strong>ユーザー:</strong> {conversation.user_message}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-sm"><strong>AI:</strong> {conversation.bot_reply}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ユーザー行動分析</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">ユーザー別の分析データは開発中です。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>パフォーマンス指標</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">詳細なパフォーマンス分析は開発中です。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
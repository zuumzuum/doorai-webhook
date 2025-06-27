'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Calendar, TrendingUp, Clock, Users, Building2, Bot, Phone } from 'lucide-react';
import { ClientOnly } from '@/components/ClientOnly';
import { SkeletonChart } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Client-only chart components
const LineChartClient = ClientOnly(() => import('@/components/charts/LineChart.client'));
const BarChartClient = ClientOnly(() => import('@/components/charts/BarChart.client'));

const mockKpiData = [
  { name: '月', inquiries: 120, appointments: 45, contracts: 12 },
  { name: '火', inquiries: 132, appointments: 52, contracts: 15 },
  { name: '水', inquiries: 98, appointments: 38, contracts: 8 },
  { name: '木', inquiries: 147, appointments: 61, contracts: 18 },
  { name: '金', inquiries: 165, appointments: 72, contracts: 22 },
  { name: '土', inquiries: 189, appointments: 89, contracts: 28 },
  { name: '日', inquiries: 201, appointments: 95, contracts: 31 },
];

const mockResponseData = [
  { name: '0-1分', count: 145 },
  { name: '1-5分', count: 89 },
  { name: '5-15分', count: 34 },
  { name: '15分+', count: 12 },
];

const recentChats = [
  { 
    id: 1, 
    customer: '田中太郎', 
    property: '新宿区1LDK', 
    time: '2分前', 
    status: 'ai', 
    priority: 'high',
    lastMessage: '内見の件でご連絡しました。来週の土曜日は空いていますでしょうか？',
    unread: 2
  },
  { 
    id: 2, 
    customer: '佐藤花子', 
    property: '渋谷区2DK', 
    time: '8分前', 
    status: 'human', 
    priority: 'medium',
    lastMessage: 'ペット可の物件はありますか？小型犬を飼っています。',
    unread: 1
  },
  { 
    id: 3, 
    customer: '山田次郎', 
    property: '品川区1K', 
    time: '15分前', 
    status: 'ai', 
    priority: 'low',
    lastMessage: 'ありがとうございました。検討させていただきます。',
    unread: 0
  },
  { 
    id: 4, 
    customer: '鈴木美里', 
    property: '池袋3LDK', 
    time: '22分前', 
    status: 'ai', 
    priority: 'high',
    lastMessage: '駅からの距離を教えてください。徒歩何分くらいでしょうか？',
    unread: 3
  },
  { 
    id: 5, 
    customer: '高橋一郎', 
    property: '上野2LDK', 
    time: '35分前', 
    status: 'human', 
    priority: 'medium',
    lastMessage: '初期費用の詳細を教えていただけますでしょうか。',
    unread: 0
  },
];

const dashboardLines = [
  { dataKey: 'inquiries', stroke: '#3B82F6', name: '問い合わせ' },
  { dataKey: 'appointments', stroke: '#10B981', name: '内見予約' },
  { dataKey: 'contracts', stroke: '#F59E0B', name: '成約' },
];

interface DashboardProps {
  onNavigateToChat?: (customerId?: number) => void;
}

export function Dashboard({ onNavigateToChat }: DashboardProps) {
  const handleChatClick = (customerId: number) => {
    if (onNavigateToChat) {
      onNavigateToChat(customerId);
    }
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ダッシュボード</h1>
          <p className="text-muted-foreground">今日の営業活動をモニタリング</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>AIエージェント稼働中</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">今日の問い合わせ</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% 昨日比
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">内見予約</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">18</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +25% 昨日比
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均応答時間</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1.2分</div>
            <p className="text-xs text-orange-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              -15% 改善
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI処理率</CardTitle>
            <Bot className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">87%</div>
            <p className="text-xs text-purple-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% 今週比
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">週次トレンド</CardTitle>
            <p className="text-sm text-muted-foreground">問い合わせ・予約・成約の推移</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SkeletonChart />}>
              <LineChartClient data={mockKpiData} lines={dashboardLines} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Response Time Distribution */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">応答時間分布</CardTitle>
            <p className="text-sm text-muted-foreground">今週の応答時間パフォーマンス</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SkeletonChart />}>
              <BarChartClient data={mockResponseData} dataKey="count" />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Recent Chats */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">最新のチャット</CardTitle>
          <p className="text-sm text-muted-foreground">直近の顧客対応状況</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentChats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => handleChatClick(chat.id)}
                className="flex items-start justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-border/50 hover:shadow-sm"
              >
                <div className="flex items-start space-x-4 flex-1">
                  {/* Priority Indicator */}
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    chat.priority === 'high' ? 'bg-red-500' : 
                    chat.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  
                  {/* Customer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-foreground">{chat.customer}</h3>
                        {chat.unread > 0 && (
                          <Badge variant="destructive" className="text-xs px-2 py-0.5 min-w-[20px] text-center">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={chat.status === 'ai' ? 'default' : 'secondary'}
                          className={cn(
                            "text-xs",
                            chat.status === 'ai' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          )}
                        >
                          {chat.status === 'ai' ? 'AI対応' : '人間対応'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{chat.time}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{chat.property}</p>
                    
                    {/* Chat Preview */}
                    <div className="bg-card/50 rounded-lg p-3 border border-border/30">
                      <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Chats Button */}
          <div className="mt-4 pt-4 border-t border-border">
            <button 
              onClick={() => handleChatClick()}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              すべてのチャットを表示
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, TrendingUp, MessageSquare, Users, Clock, Bot } from 'lucide-react';
import { ClientOnly } from '@/components/ClientOnly';
import { SkeletonChart, SkeletonPieChart } from '@/components/ui/skeleton';

// Client-only chart components
const LineChartClient = ClientOnly(() => import('@/components/charts/LineChart.client'));
const BarChartClient = ClientOnly(() => import('@/components/charts/BarChart.client'));
const PieChartClient = ClientOnly(() => import('@/components/charts/PieChart.client'));

const weeklyData = [
  { name: '1/8', inquiries: 23, responses: 22, appointments: 8, contracts: 2 },
  { name: '1/9', responses: 28, inquiries: 29, appointments: 12, contracts: 3 },
  { name: '1/10', responses: 19, inquiries: 20, appointments: 6, contracts: 1 },
  { name: '1/11', responses: 35, inquiries: 36, appointments: 15, contracts: 4 },
  { name: '1/12', responses: 42, inquiries: 43, appointments: 18, contracts: 6 },
  { name: '1/13', responses: 48, inquiries: 50, appointments: 22, contracts: 8 },
  { name: '1/14', responses: 52, inquiries: 54, appointments: 25, contracts: 9 },
];

const responseTimeData = [
  { name: '0-30秒', count: 120, percentage: 65 },
  { name: '30秒-1分', count: 45, percentage: 24 },
  { name: '1-3分', count: 15, percentage: 8 },
  { name: '3分以上', count: 5, percentage: 3 },
];

const languageData = [
  { name: '日本語', value: 75, color: '#3B82F6' },
  { name: '英語', value: 25, color: '#10B981' },
];

const channelData = [
  { channel: 'LINE', messages: 145, percentage: 60 },
  { channel: 'Webチャット', messages: 78, percentage: 32 },
  { channel: 'メール', messages: 19, percentage: 8 },
];

const weeklyLines = [
  { dataKey: 'inquiries', stroke: '#3B82F6', name: '問い合わせ' },
  { dataKey: 'appointments', stroke: '#10B981', name: '内見予約' },
  { dataKey: 'contracts', stroke: '#F59E0B', name: '成約' },
];

export function Analytics() {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">アナリティクス</h1>
          <p className="text-muted-foreground">KPIと営業パフォーマンスの詳細分析</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="7d">過去7日間</option>
            <option value="30d">過去30日間</option>
            <option value="90d">過去90日間</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            CSV出力
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">総問い合わせ数</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">301</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18% 先週比 
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              日平均: 43件
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI応答率</CardTitle>
            <Bot className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">89%</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3% 先週比
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              人間対応: 11%
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均応答時間</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0.8分</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              -22% 改善
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              目標: 1分以内
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">内見予約率</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">32%</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8% 先週比
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              業界平均: 25%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">週次パフォーマンス</CardTitle>
            <p className="text-sm text-muted-foreground">問い合わせから成約までの推移</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SkeletonChart />}>
              <LineChartClient data={weeklyData} lines={weeklyLines} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Response Time Distribution */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">応答時間分布</CardTitle>
            <p className="text-sm text-muted-foreground">AI応答の速度パフォーマンス</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SkeletonChart />}>
              <BarChartClient data={responseTimeData} dataKey="count" />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">言語別問い合わせ</CardTitle>
            <p className="text-sm text-muted-foreground">多言語対応の利用状況</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SkeletonPieChart />}>
              <PieChartClient data={languageData} />
            </Suspense>
            <div className="flex justify-center space-x-6 mt-4">
              {languageData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-foreground">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">チャンネル別実績</CardTitle>
            <p className="text-sm text-muted-foreground">各コミュニケーションチャンネルの利用状況</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelData.map((channel, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{channel.channel}</span>
                    <span className="text-sm text-muted-foreground">{channel.messages}件 ({channel.percentage}%)</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${channel.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">チャンネル分析</h4>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                LINEが最も効果的なチャンネルとして60%のシェアを占めています。
                Webチャットも32%と健全な成長を示しています。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">詳細指標</CardTitle>
          <p className="text-sm text-muted-foreground">日別パフォーマンス詳細</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-foreground">日付</th>
                  <th className="text-center py-3 px-2 text-foreground">問い合わせ</th>
                  <th className="text-center py-3 px-2 text-foreground">AI応答</th>
                  <th className="text-center py-3 px-2 text-foreground">内見予約</th>
                  <th className="text-center py-3 px-2 text-foreground">成約</th>
                  <th className="text-center py-3 px-2 text-foreground">転換率</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((day, index) => (
                  <tr key={index} className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-2 font-medium text-foreground">{day.name}</td>
                    <td className="text-center py-3 px-2 text-foreground">{day.inquiries}</td>
                    <td className="text-center py-3 px-2 text-foreground">{day.responses}</td>
                    <td className="text-center py-3 px-2 text-foreground">{day.appointments}</td>
                    <td className="text-center py-3 px-2 text-foreground">{day.contracts}</td>
                    <td className="text-center py-3 px-2 text-foreground">
                      {((day.contracts / day.inquiries) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
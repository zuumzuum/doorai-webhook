'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Search, Filter, MessageSquare, Calendar, Phone, Mail, Eye, LayoutGrid, List, Flame } from 'lucide-react';
import { useHotScore } from '@/lib/hooks/use-hot-score';
import { CustomerKanban } from '@/components/customer-kanban';
import { cn } from '@/lib/utils';

export function CustomerManagement() {
  const { 
    customers, 
    isLoading, 
    getHotScoreColor, 
    getHotScoreLabel 
  } = useHotScore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      lead: { label: 'リード', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      contacted: { label: 'コンタクト済', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
      viewing: { label: '内見予定', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
      negotiating: { label: '交渉中', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      converted: { label: '成約', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      lost: { label: '失注', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color} variant="secondary">
        {config.label}
      </Badge>
    );
  };

  const getLanguageBadge = (language: string) => {
    return (
      <Badge variant="outline" className="text-xs border-border text-foreground">
        {language === 'jp' ? '日本語' : '英語'}
      </Badge>
    );
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesLanguage = languageFilter === 'all' || customer.language === languageFilter;
    return matchesSearch && matchesStatus && matchesLanguage;
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">顧客データを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">顧客管理</h1>
          <p className="text-muted-foreground">リード・顧客情報の管理と分析</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="h-8"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              カンバン
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <List className="w-4 h-4 mr-2" />
              リスト
            </Button>
          </div>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            新規顧客追加
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'kanban')}>
        <TabsContent value="kanban">
          <CustomerKanban />
        </TabsContent>
        
        <TabsContent value="list">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="顧客名、メール、電話番号で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">全てのステータス</option>
                    <option value="lead">リード</option>
                    <option value="contacted">コンタクト済</option>
                    <option value="viewing">内見予定</option>
                    <option value="negotiating">交渉中</option>
                    <option value="converted">成約</option>
                    <option value="lost">失注</option>
                  </select>
                  <select 
                    value={languageFilter} 
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">全ての言語</option>
                    <option value="jp">日本語</option>
                    <option value="en">英語</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>顧客一覧</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCustomers
                      .sort((a, b) => b.hotScore - a.hotScore) // Sort by hot score
                      .map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-4 border border-border rounded-lg hover:border-accent-foreground/20 hover:shadow-sm transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-foreground">{customer.name}</h3>
                              <p className="text-sm text-muted-foreground">{customer.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Flame className={cn("w-4 h-4", getHotScoreColor(customer.hotScore))} />
                              <span className={cn("text-sm font-medium", getHotScoreColor(customer.hotScore))}>
                                {customer.hotScore}
                              </span>
                            </div>
                            {getStatusBadge(customer.status)}
                            {getLanguageBadge(customer.language)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">予算:</span>
                            <span className="ml-2 font-medium text-foreground">{customer.budget}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">希望エリア:</span>
                            <span className="ml-2 font-medium text-foreground">{customer.area}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">メッセージ数:</span>
                            <span className="ml-2 font-medium text-foreground">{customer.messages}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">内見予約:</span>
                            <span className="ml-2 font-medium text-foreground">{customer.appointments}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-wrap gap-1">
                            {customer.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-border text-foreground">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">最終コンタクト: {customer.lastContact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Detail Panel */}
            <div>
              {selectedCustomer ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      顧客詳細
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center border-b border-border pb-4">
                      <Avatar className="w-16 h-16 mx-auto mb-3">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-lg">
                          {selectedCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-foreground">{selectedCustomer.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                      <div className="flex justify-center space-x-2 mt-2">
                        {getStatusBadge(selectedCustomer.status)}
                        {getLanguageBadge(selectedCustomer.language)}
                      </div>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        <Flame className={cn("w-4 h-4", getHotScoreColor(selectedCustomer.hotScore))} />
                        <span className={cn("text-sm font-medium", getHotScoreColor(selectedCustomer.hotScore))}>
                          ホットスコア: {selectedCustomer.hotScore} ({getHotScoreLabel(selectedCustomer.hotScore)})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{selectedCustomer.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">活動サマリー</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-foreground">{selectedCustomer.messages} メッセージ</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span className="text-foreground">{selectedCustomer.appointments} 内見予約</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-purple-500" />
                          <span className="text-foreground">{selectedCustomer.propertyViews} 物件閲覧</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-orange-500" />
                          <span className="text-foreground">{selectedCustomer.followUpCount} フォローアップ</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">希望条件</h4>
                      <div className="text-sm space-y-1">
                        <div><span className="text-muted-foreground">予算:</span> <span className="text-foreground">{selectedCustomer.budget}</span></div>
                        <div><span className="text-muted-foreground">エリア:</span> <span className="text-foreground">{selectedCustomer.area}</span></div>
                        <div><span className="text-muted-foreground">エンゲージメント:</span> <span className="text-foreground">{selectedCustomer.engagementLevel}</span></div>
                        <div><span className="text-muted-foreground">平均応答時間:</span> <span className="text-foreground">{selectedCustomer.responseTime}分</span></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">タグ</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCustomer.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-border text-foreground">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          チャット
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-1" />
                          通話
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>顧客を選択すると詳細が表示されます</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {customers.filter(c => c.hotScore >= 80).length}
                  </div>
                  <p className="text-sm text-muted-foreground">ホットリード</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {customers.filter(c => c.hotScore >= 60 && c.hotScore < 80).length}
                  </div>
                  <p className="text-sm text-muted-foreground">ウォームリード</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {customers.filter(c => c.status === 'converted').length}
                  </div>
                  <p className="text-sm text-muted-foreground">今月の成約</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {customers.length}
                  </div>
                  <p className="text-sm text-muted-foreground">総顧客数</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
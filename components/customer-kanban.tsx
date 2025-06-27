'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  Calendar, 
  Phone, 
  Mail,
  TrendingUp,
  Clock,
  Eye,
  Flame,
  Globe
} from 'lucide-react';
import { useHotScore, Customer } from '@/lib/hooks/use-hot-score';
import { cn } from '@/lib/utils';

const statusConfig = {
  lead: { 
    label: 'リード', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  contacted: { 
    label: 'コンタクト済', 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    bgColor: 'bg-purple-50 dark:bg-purple-900/10',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  viewing: { 
    label: '内見予定', 
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    bgColor: 'bg-orange-50 dark:bg-orange-900/10',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  negotiating: { 
    label: '交渉中', 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  converted: { 
    label: '成約', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    bgColor: 'bg-green-50 dark:bg-green-900/10',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  lost: { 
    label: '失注', 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    bgColor: 'bg-gray-50 dark:bg-gray-900/10',
    borderColor: 'border-gray-200 dark:border-gray-700'
  }
};

interface CustomerCardProps {
  customer: Customer;
  onStatusChange: (customerId: number, newStatus: Customer['status']) => void;
  getHotScoreColor: (score: number) => string;
  getHotScoreLabel: (score: number) => string;
}

function CustomerCard({ customer, onStatusChange, getHotScoreColor, getHotScoreLabel }: CustomerCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', customer.id.toString());
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "cursor-move transition-all duration-200 hover:shadow-md border",
        isDragging ? "opacity-50 rotate-2 scale-105" : "hover:scale-[1.02]"
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{customer.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {customer.language === 'en' && (
              <Globe className="w-3 h-3 text-blue-500" />
            )}
            <div className="flex items-center space-x-1">
              <Flame className={cn("w-3 h-3", getHotScoreColor(customer.hotScore))} />
              <span className={cn("text-xs font-medium", getHotScoreColor(customer.hotScore))}>
                {customer.hotScore}
              </span>
            </div>
          </div>
        </div>

        {/* Hot Score Badge */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn("text-xs", getHotScoreColor(customer.hotScore))}
          >
            {getHotScoreLabel(customer.hotScore)}
          </Badge>
          <span className="text-xs text-muted-foreground">{customer.lastContact}</span>
        </div>

        {/* Budget and Area */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">予算:</span>
            <span className="font-medium text-foreground">{customer.budget}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">エリア:</span>
            <span className="font-medium text-foreground">{customer.area}</span>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3 h-3 text-blue-500" />
            <span className="text-foreground">{customer.messages}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-green-500" />
            <span className="text-foreground">{customer.appointments}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3 text-purple-500" />
            <span className="text-foreground">{customer.propertyViews}</span>
          </div>
        </div>

        {/* Tags */}
        {customer.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {customer.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {customer.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{customer.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-1 pt-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 flex-1">
            <MessageSquare className="w-3 h-3 mr-1" />
            <span className="text-xs">チャット</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 flex-1">
            <Phone className="w-3 h-3 mr-1" />
            <span className="text-xs">通話</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface KanbanColumnProps {
  status: Customer['status'];
  customers: Customer[];
  onStatusChange: (customerId: number, newStatus: Customer['status']) => void;
  getHotScoreColor: (score: number) => string;
  getHotScoreLabel: (score: number) => string;
}

function KanbanColumn({ status, customers, onStatusChange, getHotScoreColor, getHotScoreLabel }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = statusConfig[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const customerId = parseInt(e.dataTransfer.getData('text/plain'));
    onStatusChange(customerId, status);
  };

  const totalHotScore = customers.reduce((sum, customer) => sum + customer.hotScore, 0);
  const avgHotScore = customers.length > 0 ? Math.round(totalHotScore / customers.length) : 0;

  return (
    <div className="flex-1 min-w-[300px]">
      <Card className={cn("h-full", config.bgColor, config.borderColor)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <span>{config.label}</span>
              <Badge variant="secondary" className="text-xs">
                {customers.length}
              </Badge>
            </CardTitle>
            {customers.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>平均: {avgHotScore}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent 
          className={cn(
            "space-y-3 min-h-[400px] transition-colors duration-200",
            isDragOver && "bg-accent/50 border-2 border-dashed border-primary"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {customers.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">顧客なし</p>
              </div>
            </div>
          ) : (
            customers
              .sort((a, b) => b.hotScore - a.hotScore) // Sort by hot score descending
              .map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onStatusChange={onStatusChange}
                  getHotScoreColor={getHotScoreColor}
                  getHotScoreLabel={getHotScoreLabel}
                />
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function CustomerKanban() {
  const { 
    customers, 
    isLoading, 
    updateCustomerStatus, 
    getHotScoreColor, 
    getHotScoreLabel, 
    getCustomersByStatus,
    getTopHotCustomers
  } = useHotScore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'jp' | 'en'>('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = languageFilter === 'all' || customer.language === languageFilter;
    return matchesSearch && matchesLanguage;
  });

  const statuses: Customer['status'][] = ['lead', 'contacted', 'viewing', 'negotiating', 'converted', 'lost'];

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">顧客管理 - カンバンボード</h1>
          <p className="text-muted-foreground">ドラッグ&ドロップで顧客ステータスを管理</p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          新規顧客追加
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="顧客名、メールで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select 
                value={languageFilter} 
                onChange={(e) => setLanguageFilter(e.target.value as 'all' | 'jp' | 'en')}
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

      {/* Hot Customers Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-red-500" />
            <span>ホット顧客</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {getTopHotCustomers(5).map((customer) => (
              <div key={customer.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs">
                    {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{customer.name}</p>
                  <div className="flex items-center space-x-1">
                    <Flame className={cn("w-3 h-3", getHotScoreColor(customer.hotScore))} />
                    <span className={cn("text-xs font-medium", getHotScoreColor(customer.hotScore))}>
                      {customer.hotScore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            customers={getCustomersByStatus(status).filter(customer => {
              const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   customer.email.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesLanguage = languageFilter === 'all' || customer.language === languageFilter;
              return matchesSearch && matchesLanguage;
            })}
            onStatusChange={updateCustomerStatus}
            getHotScoreColor={getHotScoreColor}
            getHotScoreLabel={getHotScoreLabel}
          />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {statuses.map((status) => {
          const statusCustomers = getCustomersByStatus(status);
          const config = statusConfig[status];
          return (
            <Card key={status}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{statusCustomers.length}</div>
                  <p className="text-sm text-muted-foreground">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
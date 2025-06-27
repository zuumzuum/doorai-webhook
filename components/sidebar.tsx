'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/components/auth-provider';
import {
  LayoutDashboard,
  MessageSquare,
  Building2,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Sun,
  Moon,
  Zap,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  daysRemaining: number | null;
  isLoading: boolean;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
  { id: 'chat', icon: MessageSquare, label: 'チャット' },
  { id: 'properties', icon: Building2, label: '物件管理' },
  { id: 'customers', icon: Users, label: '顧客管理' },
  { id: 'analytics', icon: BarChart3, label: '分析' },
  { id: 'settings', icon: Settings, label: '設定' },
];

export function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, daysRemaining, isLoading }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-card/95 backdrop-blur-sm border-r border-border/50 transition-all duration-300 z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-logo bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                DoorAI
              </h1>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 hover:bg-accent/50"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "sidebar-item w-full",
                isActive && "active"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="absolute bottom-4 left-3 right-3 space-y-3">
          {/* User Info */}
          {user && (
            <div className="glass-card rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">ログイン中</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex-1 justify-start gap-2 h-9 hover:bg-accent/50"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'ライト' : 'ダーク'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex-1 justify-start gap-2 h-9 hover:bg-accent/50 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </Button>
          </div>

          {!isLoading && (
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">トライアル</span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full border",
                  daysRemaining !== null ? 
                    (daysRemaining > 3 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                     daysRemaining > 0 ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                     'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20') :
                    'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
                )}>
                  {daysRemaining !== null ? 
                    (daysRemaining > 0 ? `残り${daysRemaining}日` : '終了') : 
                    '読み込み中...'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>使用量</span>
                  <span>{daysRemaining !== null ? Math.round(100 - Math.max(0, (daysRemaining / 14) * 100)) : '...'}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div 
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      daysRemaining !== null ? 
                        (daysRemaining > 3 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                         daysRemaining > 0 ? "bg-gradient-to-r from-red-500 to-red-600" :
                         "bg-gradient-to-r from-gray-400 to-gray-500") :
                        "bg-gradient-to-r from-gray-400 to-gray-500"
                    )} 
                    style={{ width: `${daysRemaining !== null ? Math.max(0, (daysRemaining / 14) * 100) : 100}%` }} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
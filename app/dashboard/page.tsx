'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Dashboard } from '@/components/dashboard';
import { ChatViewer } from '@/components/chat-viewer';
import { PropertyManagement } from '@/components/property-management';
import { CustomerManagement } from '@/components/customer-management';
import { Analytics } from '@/components/analytics';
import { Settings } from '@/components/settings';
import { ChatWidget } from '@/components/chat-widget';
import { useTrial } from '@/lib/hooks/use-trial';
import { TrialExpiredOverlay } from '@/components/trial-expired-overlay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const { daysRemaining, isTrialExpired, isTrialEndingSoon, isLoading } = useTrial();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleNavigateToChat = (customerId?: number) => {
    if (customerId) {
      setSelectedCustomerId(customerId);
    }
    setActiveTab('chat');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigateToChat={handleNavigateToChat} />;
      case 'chat':
        return <ChatViewer selectedCustomerId={selectedCustomerId} />;
      case 'properties':
        return <PropertyManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigateToChat={handleNavigateToChat} />;
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect to login)
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {isClient && !isLoading && isTrialExpired && <TrialExpiredOverlay />}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        daysRemaining={daysRemaining}
        isLoading={isLoading}
      />
      <main className={`flex-1 overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {isClient && !isLoading && isTrialEndingSoon && !isTrialExpired && (
          <div className="p-6">
            <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
              <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle className="text-yellow-900 dark:text-yellow-100">試用期間終了間近！</AlertTitle>
              <AlertDescription>
                無料試用期間は残り <span className="font-bold">{daysRemaining}日</span> です。サービスを継続してご利用いただくには、設定タブからプランをご確認ください。
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('settings')}
                  className="p-0 h-auto text-yellow-800 hover:text-yellow-900 dark:text-yellow-200 dark:hover:text-yellow-100 ml-2 inline-flex items-center gap-1"
                >
                  <SettingsIcon className="w-4 h-4" />
                  設定タブを開く
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        {renderContent()}
      </main>
      <ChatWidget />
    </div>
  );
} 
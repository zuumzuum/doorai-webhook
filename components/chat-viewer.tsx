'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Clock, Send, MoreVertical, Phone, Calendar, ArrowRightLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockCustomers = [
  { id: 1, name: '田中太郎', lastMessage: '内見の件でご連絡しました', time: '2分前', unread: 3, status: 'ai' },
  { id: 2, name: '佐藤花子', lastMessage: 'ペット可物件はありますか？', time: '5分前', unread: 1, status: 'human' },
  { id: 3, name: '山田次郎', lastMessage: 'ありがとうございました', time: '15分前', unread: 0, status: 'ai' },
  { id: 4, name: '鈴木美里', lastMessage: '駅からの距離を教えてください', time: '22分前', unread: 2, status: 'ai' },
];

const mockMessages = [
  { id: 1, sender: 'customer', content: 'こんにちは、新宿区の1LDKを探しています', time: '14:30', type: 'text' },
  { id: 2, sender: 'ai', content: 'こんにちは！新宿区の1LDKをお探しですね。ご予算と希望する最寄り駅はございますか？', time: '14:31', type: 'text' },
  { id: 3, sender: 'customer', content: '予算は12万円程度、新宿駅から徒歩15分以内が希望です', time: '14:32', type: 'text' },
  { id: 4, sender: 'ai', content: 'かしこまりました。条件に合う物件をいくつかご紹介させていただきます。', time: '14:33', type: 'text' },
  { id: 5, sender: 'ai', content: '【物件A】新宿区西新宿 1LDK 11.5万円 新宿駅徒歩12分\n築年数: 5年\n設備: オートロック、宅配ボックス', time: '14:34', type: 'property' },
  { id: 6, sender: 'customer', content: 'いいですね！内見は可能ですか？', time: '14:35', type: 'text' },
  { id: 7, sender: 'ai', content: '内見予約を承ります。以下のURLから空き状況をご確認ください。\nhttps://doorai.com/booking/abc123', time: '14:36', type: 'booking' },
];

interface ChatViewerProps {
  selectedCustomerId?: number | null;
}

export function ChatViewer({ selectedCustomerId }: ChatViewerProps) {
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);
  const [newMessage, setNewMessage] = useState('');
  const [isAiMode, setIsAiMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // selectedCustomerIdが変更されたときに対応する顧客を選択
  useEffect(() => {
    if (selectedCustomerId) {
      const customer = mockCustomers.find(c => c.id === selectedCustomerId);
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
  }, [selectedCustomerId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Customer List */}
      <div className="w-80 bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">チャット一覧</h2>
              <p className="text-sm text-muted-foreground">顧客との会話履歴</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="顧客を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <div className="overflow-y-auto h-full">
          {mockCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className={cn(
                "p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors",
                selectedCustomer.id === customer.id && "bg-accent border-accent-foreground/20"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-foreground">{customer.name}</h3>
                <div className="flex items-center space-x-2">
                  {customer.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                      {customer.unread}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{customer.time}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground truncate mb-2">{customer.lastMessage}</p>
              <Badge variant={customer.status === 'ai' ? 'default' : 'secondary'} className="text-xs">
                {customer.status === 'ai' ? 'AI対応中' : '人間対応中'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedCustomer.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="text-sm text-muted-foreground">オンライン</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={isAiMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAiMode(!isAiMode)}
                className="transition-all duration-200"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                {isAiMode ? 'AI対応中' : '人間対応中'}
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                通話
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                予約
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'ai' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm",
                message.sender === 'ai' 
                  ? "bg-blue-600 text-white ml-12" 
                  : "bg-card border border-border mr-12"
              )}>
                {message.sender === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="w-4 h-4 text-blue-200" />
                    <span className="text-xs text-blue-200 font-medium">AIエージェント</span>
                  </div>
                )}
                <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={cn(
                    "text-xs",
                    message.sender === 'ai' ? "text-blue-200" : "text-muted-foreground"
                  )}>
                    {message.time}
                  </span>
                  {message.type === 'booking' && (
                    <Calendar className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center space-x-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isAiMode ? "AIが自動で応答します..." : "メッセージを入力..."}
              disabled={isAiMode}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isAiMode || !newMessage.trim()}
              size="sm"
              className="px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {isAiMode && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
              <Bot className="w-3 h-3" />
              AI自動対応モードが有効です。必要に応じて人間対応に切り替えてください。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
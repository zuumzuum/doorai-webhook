'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Upload, Search, Filter, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const mockProperties = [
  {
    id: 1,
    title: '新宿区西新宿 1LDK',
    address: '東京都新宿区西新宿1-1-1',
    rent: 115000,
    deposit: 230000,
    station: '新宿駅',
    walkTime: 12,
    age: 5,
    area: 35.5,
    status: 'available',
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: '渋谷区恵比寿 2LDK',
    address: '東京都渋谷区恵比寿1-2-3',
    rent: 185000,
    deposit: 370000,
    station: '恵比寿駅',
    walkTime: 8,
    age: 3,
    area: 52.3,
    status: 'reserved',
    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: '品川区五反田 1K',
    address: '東京都品川区五反田2-3-4',
    rent: 98000,
    deposit: 196000,
    station: '五反田駅',
    walkTime: 6,
    age: 8,
    area: 25.8,
    status: 'available',
    imageUrl: 'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    title: '池袋駅前 3LDK',
    address: '東京都豊島区池袋1-4-5',
    rent: 225000,
    deposit: 450000,
    station: '池袋駅',
    walkTime: 3,
    age: 2,
    area: 68.2,
    status: 'rented',
    imageUrl: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
];

export function PropertyManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: '募集中', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      reserved: { label: '予約済', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      rented: { label: '契約済', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color} variant="secondary">
        {config.label}
      </Badge>
    );
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleNewProperty = () => {
    router.push('/properties/new');
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">物件管理</h1>
          <p className="text-muted-foreground">物件の登録・編集・公開状況を管理</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleFileUpload} disabled={isUploading}>
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? `アップロード中... ${uploadProgress}%` : 'CSV取込'}
          </Button>
          <Button onClick={handleNewProperty}>
            <Plus className="w-4 h-4 mr-2" />
            新規登録
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">物件データ取込中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>進捗状況</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="物件名、住所、駅名で検索..."
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
                <option value="available">募集中</option>
                <option value="reserved">予約済</option>
                <option value="rented">契約済</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              <img 
                src={property.imageUrl} 
                alt={property.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-3 right-3">
                {getStatusBadge(property.status)}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2">{property.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{property.address}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">賃料</span>
                  <span className="font-medium text-foreground">¥{property.rent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">敷金</span>
                  <span className="text-foreground">¥{property.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最寄駅</span>
                  <span className="text-foreground">{property.station} 徒歩{property.walkTime}分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">築年数・専有面積</span>
                  <span className="text-foreground">築{property.age}年 / {property.area}㎡</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Building2 className="w-3 h-3 mr-1" />
                  ID: {property.id}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">125</div>
              <p className="text-sm text-muted-foreground">募集中</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">23</div>
              <p className="text-sm text-muted-foreground">予約済</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">45</div>
              <p className="text-sm text-muted-foreground">契約済</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">193</div>
              <p className="text-sm text-muted-foreground">総物件数</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
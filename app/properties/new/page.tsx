'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CsvImport } from '@/components/csv-import';
import { QuickForm } from '@/components/quick-form';

export default function NewPropertyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>戻る</span>
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-semibold text-foreground">物件新規登録</h1>
            <p className="text-muted-foreground">CSV取込または手動入力で物件を登録</p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <Tabs defaultValue="csv" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="csv">CSV取込</TabsTrigger>
                <TabsTrigger value="manual">手動登録</TabsTrigger>
              </TabsList>
              
              <TabsContent value="csv" className="mt-6">
                <CsvImport />
              </TabsContent>
              
              <TabsContent value="manual" className="mt-6">
                <QuickForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
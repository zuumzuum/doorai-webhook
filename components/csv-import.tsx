'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, XCircle, Download } from 'lucide-react';

const sampleRows = [
  { id: 1, name: '新宿区西新宿マンション', status: 'success', message: '正常に登録されました' },
  { id: 2, name: '渋谷区恵比寿アパート', status: 'success', message: '正常に登録されました' },
  { id: 3, name: '品川区五反田ハイツ', status: 'error', message: '必須項目が不足しています' },
  { id: 4, name: '池袋駅前マンション', status: 'success', message: '正常に登録されました' },
];

export function CsvImport() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<typeof sampleRows>([]);
  const [uploadComplete, setUploadComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          setUploadResults(sampleRows);
          // TODO: バックエンド呼び出し
          console.log('CSV upload completed:', file.name);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadTemplate = () => {
    // TODO: テンプレートCSVダウンロード
    console.log('Download CSV template');
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>CSVファイルアップロード</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-border hover:border-accent-foreground/20 hover:bg-accent/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              {isDragActive ? (
                <p className="text-blue-600 dark:text-blue-400 font-medium">ファイルをドロップしてください</p>
              ) : (
                <div>
                  <p className="text-foreground font-medium mb-2">
                    CSVファイルをドラッグ&ドロップまたはクリックして選択
                  </p>
                  <p className="text-sm text-muted-foreground">
                    対応形式: .csv (最大10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              テンプレートをダウンロード
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>アップロード中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>進捗状況</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Results */}
      {uploadComplete && uploadResults.length > 0 && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>取込結果</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {uploadResults.filter(r => r.status === 'success').length}件の物件が正常に登録されました。
                {uploadResults.filter(r => r.status === 'error').length > 0 && 
                  `${uploadResults.filter(r => r.status === 'error').length}件でエラーが発生しました。`
                }
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {uploadResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{result.name}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                  </div>
                  <Badge
                    variant={result.status === 'success' ? 'default' : 'destructive'}
                    className={result.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'dark:bg-red-900/30 dark:text-red-300'}
                  >
                    {result.status === 'success' ? '成功' : 'エラー'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
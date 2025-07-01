'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Mail, ArrowLeft, CheckCircle, AlertCircle, Sun, Moon } from 'lucide-react';
import { forgotPassword } from '@/actions/auth-actions';
import Link from 'next/link';

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  return (
    <>
      {/* Success Message */}
      {message && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-300">
            {message}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {!message && (
        <form action={forgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              メールアドレス
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@company.com"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            リセットメールを送信
          </Button>
        </form>
      )}

      <div className="pt-4">
        <Link
          href="/login"
          className="flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ログインページに戻る</span>
        </Link>
      </div>
    </>
  );
}

export default function ForgotPasswordPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-10 h-10 p-0 bg-white/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 dark:bg-gray-800/80 dark:hover:bg-gray-700/50 transition-all duration-200 shadow-lg"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-yellow-500" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DoorAI
            </h1>
            <p className="text-muted-foreground mt-2">
              パスワードをリセット
            </p>
          </div>
        </div>

        {/* Reset Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">
              パスワードを忘れた方
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              登録されたメールアドレスにパスワードリセットリンクを送信します
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Suspense fallback={<div>読み込み中...</div>}>
              <ForgotPasswordForm />
            </Suspense>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>© 2024 DoorAI</span>
          </div>
        </div>
      </div>
    </div>
  );
}